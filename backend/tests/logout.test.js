const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const TokenBlacklist = require('../models/TokenBlacklist');
const connectDB = require('../config/db');
const mongoose = require('mongoose');

describe('Logout Functionality', () => {
  let teacherToken;
  let teacherId;
  let teacher;

  beforeAll(async () => {
    // Connect to test database
    await connectDB();

    // Create a test teacher
    const hashedPassword = await bcrypt.hash('password123', 10);
    teacher = await Teacher.create({
      id: 'teacher-logout-test',
      username: 'teacher_logout',
      password: hashedPassword,
      name: 'Test',
      surname: 'Teacher',
      email: 'logout@test.com',
      phone: '+998901234567',
      address: 'Test Address',
      bloodType: 'A+',
      birthday: new Date('1990-01-01'),
      sex: 'MALE'
    });

    teacherId = teacher._id;

    // Generate test token
    teacherToken = jwt.sign(
      { id: teacherId, role: 'teacher' },
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Clean up
    await Teacher.deleteMany({ username: 'teacher_logout' });
    await TokenBlacklist.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up blacklisted tokens after each test
    await TokenBlacklist.deleteMany({});
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Logged out successfully');

      // Verify token is in blacklist
      const blacklistedToken = await TokenBlacklist.findOne({ token: teacherToken });
      expect(blacklistedToken).toBeTruthy();
      expect(blacklistedToken.userId).toBe(teacherId.toString());
      expect(blacklistedToken.role).toBe('teacher');
    });

    it('should fail logout without token', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('Not authorized');
    });

    it('should fail logout with invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not allow using blacklisted token', async () => {
      // First logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${teacherToken}`);

      // Try to use the same token
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('invalidated');
    });

    it('should not allow accessing protected routes after logout', async () => {
      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${teacherToken}`);

      // Try to access protected route
      const res = await request(app)
        .put('/api/auth/updatepassword')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/logout-all', () => {
    it('should logout from all devices successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout-all')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('Logged out from current device');

      // Verify token is in blacklist
      const blacklistedToken = await TokenBlacklist.findOne({ token: teacherToken });
      expect(blacklistedToken).toBeTruthy();
    });

    it('should fail logout-all without token', async () => {
      const res = await request(app)
        .post('/api/auth/logout-all');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not allow using token after logout-all', async () => {
      // Logout from all devices
      await request(app)
        .post('/api/auth/logout-all')
        .set('Authorization', `Bearer ${teacherToken}`);

      // Try to use the token
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('Token Blacklist Expiration', () => {
    it('should store token with correct expiration time', async () => {
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${teacherToken}`);

      const blacklistedToken = await TokenBlacklist.findOne({ token: teacherToken });
      expect(blacklistedToken).toBeTruthy();
      expect(blacklistedToken.expiresAt).toBeInstanceOf(Date);
      
      // Check if expiration is in the future
      expect(blacklistedToken.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should handle expired tokens gracefully', async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { id: teacherId, role: 'teacher' },
        process.env.JWT_SECRET || 'test-secret-key',
        { expiresIn: '0s' }
      );

      // Wait a moment to ensure token is expired
      await new Promise(resolve => setTimeout(resolve, 1000));

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('Multiple Logout Attempts', () => {
    it('should handle double logout gracefully', async () => {
      // First logout
      const res1 = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res1.statusCode).toBe(200);

      // Second logout with same token
      const res2 = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res2.statusCode).toBe(401);
      expect(res2.body.error).toContain('invalidated');
    });
  });

  describe('Login After Logout', () => {
    it('should allow login after logout', async () => {
      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${teacherToken}`);

      // Login again
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'teacher_logout',
          password: 'password123',
          role: 'teacher'
        });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body).toHaveProperty('success', true);
      expect(loginRes.body).toHaveProperty('token');

      // New token should work
      const newToken = loginRes.body.token;
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${newToken}`);

      expect(meRes.statusCode).toBe(200);
      expect(meRes.body).toHaveProperty('success', true);
    });
  });

  describe('Different User Roles Logout', () => {
    it('should handle admin logout', async () => {
      const adminToken = jwt.sign(
        { id: 'admin', role: 'admin' },
        process.env.JWT_SECRET || 'test-secret-key',
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  describe('Concurrent Logout Requests', () => {
    it('should handle concurrent logout requests', async () => {
      const promises = [
        request(app)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${teacherToken}`),
        request(app)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${teacherToken}`)
      ];

      const results = await Promise.allSettled(promises);
      
      // At least one should succeed
      const successCount = results.filter(r => 
        r.status === 'fulfilled' && r.value.statusCode === 200
      ).length;
      
      expect(successCount).toBeGreaterThanOrEqual(1);
    });
  });
});