const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../server');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Teacher API Tests', () => {
  let adminToken;

  beforeAll(async () => {
    // Create admin user and generate token
    const adminPayload = {
      id: 'admin123',
      role: 'admin'
    };
    
    adminToken = jwt.sign(
      adminPayload,
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '1h' }
    );
  });

  beforeEach(async () => {
    // Clean up before each test
    await Teacher.deleteMany({});
  });

  describe('GET /api/teachers', () => {
    it('should get all teachers with pagination', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await Teacher.create([
        {
          id: 'teacher1',
          username: 'teacher1',
          password: hashedPassword,
          name: 'John',
          surname: 'Doe',
          email: 'john@school.com',
          phone: '+998901234567',
          address: 'Address 1',
          bloodType: 'A+',
          birthday: new Date('1985-01-15'),
          sex: 'MALE'
        },
        {
          id: 'teacher2',
          username: 'teacher2',
          password: hashedPassword,
          name: 'Jane',
          surname: 'Smith',
          email: 'jane@school.com',
          phone: '+998901234568',
          address: 'Address 2',
          bloodType: 'B+',
          birthday: new Date('1990-05-20'),
          sex: 'FEMALE'
        }
      ]);

      const res = await request(app)
        .get('/api/teachers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body).toHaveProperty('count', 2);
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('currentPage');
    });

    it('should filter teachers by search query', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await Teacher.create([
        {
          id: 'teacher3',
          username: 'teacher3',
          password: hashedPassword,
          name: 'Alice',
          surname: 'Johnson',
          email: 'alice@school.com',
          phone: '+998901234569',
          address: 'Address 3',
          bloodType: 'O+',
          birthday: new Date('1990-03-20'),
          sex: 'FEMALE'
        },
        {
          id: 'teacher4',
          username: 'teacher4',
          password: hashedPassword,
          name: 'Bob',
          surname: 'Wilson',
          email: 'bob@school.com',
          phone: '+998901234570',
          address: 'Address 4',
          bloodType: 'AB+',
          birthday: new Date('1988-07-10'),
          sex: 'MALE'
        }
      ]);

      const res = await request(app)
        .get('/api/teachers?search=Alice')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty('name', 'Alice');
    });

    it('should handle pagination correctly', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create 15 teachers
      const teachers = [];
      for (let i = 1; i <= 15; i++) {
        teachers.push({
          id: `teacher${i}`,
          username: `teacher${i}`,
          password: hashedPassword,
          name: `Teacher${i}`,
          surname: `Surname${i}`,
          email: `teacher${i}@school.com`,
          phone: `+99890123456${i}`,
          address: `Address ${i}`,
          bloodType: 'A+',
          birthday: new Date('1990-01-01'),
          sex: 'MALE'
        });
      }
      await Teacher.create(teachers);

      const res = await request(app)
        .get('/api/teachers?page=2&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.currentPage).toBe('2');
      expect(res.body.totalPages).toBe(2);
    });
  });

  describe('DELETE /api/teachers/:id', () => {
    it('should delete a teacher', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const teacher = await Teacher.create({
        id: 'teacher6',
        username: 'teacher6',
        password: hashedPassword,
        name: 'Delete',
        surname: 'Test',
        email: 'delete@school.com',
        phone: '+998901234574',
        address: 'Address',
        bloodType: 'A+',
        birthday: new Date('1990-01-01'),
        sex: 'MALE'
      });

      const res = await request(app)
        .delete(`/api/teachers/${teacher._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);

      const deletedTeacher = await Teacher.findById(teacher._id);
      expect(deletedTeacher).toBeNull();
    });

    it('should return 404 for non-existent teacher', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/teachers/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app)
        .delete('/api/teachers/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid');
    });
  });

  describe('POST /api/teachers', () => {
    it('should create a new teacher', async () => {
      const newTeacher = {
        id: 'teacher7',
        username: 'newteacher',
        password: 'password123',
        name: 'New',
        surname: 'Teacher',
        email: 'new@school.com',
        phone: '+998901234575',
        address: 'New Address',
        bloodType: 'A+',
        birthday: '1990-01-01',
        sex: 'MALE'
      };

      const res = await request(app)
        .post('/api/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newTeacher);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('username', 'newteacher');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should not create teacher with duplicate username', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await Teacher.create({
        id: 'teacher8',
        username: 'duplicate',
        password: hashedPassword,
        name: 'Existing',
        surname: 'Teacher',
        email: 'existing@school.com',
        phone: '+998901234576',
        address: 'Address',
        bloodType: 'A+',
        birthday: new Date('1990-01-01'),
        sex: 'MALE'
      });

      const newTeacher = {
        id: 'teacher9',
        username: 'duplicate',
        password: 'password123',
        name: 'New',
        surname: 'Teacher',
        email: 'new2@school.com',
        phone: '+998901234577',
        address: 'Address',
        bloodType: 'A+',
        birthday: '1990-01-01',
        sex: 'MALE'
      };

      const res = await request(app)
        .post('/api/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newTeacher);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/teachers/:id', () => {
    it('should update a teacher', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const teacher = await Teacher.create({
        id: 'teacher10',
        username: 'updatetest',
        password: hashedPassword,
        name: 'Update',
        surname: 'Test',
        email: 'update@school.com',
        phone: '+998901234578',
        address: 'Address',
        bloodType: 'A+',
        birthday: new Date('1990-01-01'),
        sex: 'MALE'
      });

      const updateData = {
        name: 'Updated',
        surname: 'Name'
      };

      const res = await request(app)
        .put(`/api/teachers/${teacher._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('name', 'Updated');
      expect(res.body.data).toHaveProperty('surname', 'Name');
    });
  });
});