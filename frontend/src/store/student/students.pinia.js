import { defineStore } from "pinia";
import { useCore } from "../core.pinia";
import { getStudent, getStudents } from "@/services/modules/students/students.service";

export const useStudentsStore = defineStore("students", {
  state: () => ({
    // Talabalar ro'yxati
    students: [],

    // Pagination ma'lumotlari
    pagination: {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    },

    // Qidiruv so'zi
    searchQuery: "",

    // Filterlar
    filters: {
      classId: null,
      gradeId: null,
      sex: null,
    },

    // Loading holati
    loading: false,

    // Tanlangan talaba (bitta talaba ma'lumotlari)
    selectedStudent: null,
  }),
  getters: {
    getStudents: (state) => state.students,
    isLoading: (state) => state.loading,
    getSelectedStudent: (state) => state.selectedStudent,
  },
  actions: {
    /**
     * Barcha talabalarni yuklash
     * @param {Object} options - Qo'shimcha parametrlar
     */
    async fetchStudents(options = {}) {
      this.loading = true;
      const core = useCore();

      try {
        // Service'dan talabalarni olish
        const result = await getStudents({
          page: options.page || this.pagination.currentPage,
          limit: options.pageSize || this.pagination.pageSize,
          search: options.search || this.searchQuery,
          classId: options.classId || this.filters.classId,
          gradeId: options.gradeId || this.filters.gradeId,
          sex: options.sex || this.filters.sex,
        });

        if (result.success) {
          // State'ni yangilash
          this.students = result.data;
          this.pagination = {
            currentPage: result.currentPage,
            pageSize: options.pageSize || this.pagination.pageSize,
            total: result.count,
            totalPages: result.totalPages,
          };
        } else {
          // Xatolik bo'lsa
          core.setToast({
            type: "error",
            message: result.error,
          });
          this.students = [];
        }
      } catch (error) {
        core.setToast({
          type: "error",
          message: "Talabalar yuklashda xatolik yuz berdi",
        });
        this.students = [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Bitta studentni ID bo'yicha olish
     * @param {string} id - Student ID
     */
    async fetchStudent(id){
        this.loading = true;
        const core = useCore();

        try{
            // Service'dan studentni olish
            const result = await getStudent(id);

            if(result.success){
                this.selectedStudent = result.data;
            }else{
                core.setToast({
                    type: 'error',
                    message: result.error,
                });
                this.selectedStudent = null;
            }
        }catch(error){
            core.setToast({
                type: 'error',
                message: 'Studentni olishda xatolik yuz berdi',
            })
            this.selectedStudent = null;
        }finally{
            this.loading = false;
        }
    }
  },
});
