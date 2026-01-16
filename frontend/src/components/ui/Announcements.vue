<template>
    <a-card 
        :bordered="false" 
        class="shadow-sm"
    >
        <template #title>
            <a-space>
                <IconAnnouncement class="w-5 h-5" />
                <span>E'lonlar</span>
                <a-badge :count="announcementsCount" :overflow-count="99" />
            </a-space>
        </template>
        <template #extra>
            <router-link :to="{ name: announcementsRouteName }">
                <a-button type="link" size="small">
                    Barchasini ko'rish
                </a-button>
            </router-link>
        </template>

        <!-- Loading State -->
        <a-spin :spinning="isLoading" tip="E'lonlar yuklanmoqda...">
            <!-- Empty State -->
            <a-empty 
                v-if="!isLoading && !announcements.length"
                description="E'lonlar mavjud emas"
                :image="Empty.PRESENTED_IMAGE_SIMPLE"
            >
                <a-button type="primary" v-if="isAdmin">
                    <template #icon>
                        <IconPlus class="w-4 h-4" />
                    </template>
                    E'lon qo'shish
                </a-button>
            </a-empty>

            <!-- Announcements List -->
            <a-list
                v-else
                :data-source="announcements"
                :split="false"
            >
                <template #renderItem="{ item, index }">
                    <a-list-item class="px-0">
                        <a-card 
                            :bordered="false"
                            size="small"
                            class="w-full"
                            :class="index % 2 === 0 ? 'bg-blue-50' : 'bg-purple-50'"
                        >
                            <template #title>
                                <a-typography-title :level="5" class="">
                                    {{ item.title }}
                                </a-typography-title>
                            </template>
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex-1">
                                    <a-space direction="vertical" :size="4" class="w-full">
                                        <a-typography-paragraph 
                                            class="!mb-0 text-gray-500" 
                                            :ellipsis="{ rows: 2, expandable: true, symbol: 'Ko\'proq' }"
                                            :content="item.description"
                                        >
                                        </a-typography-paragraph>
                                        <a-tag color="blue">
                                            <template #icon>
                                                <IconClock class="w-3 h-3" />
                                            </template>
                                            {{ formatDate(item.date) }}
                                        </a-tag>
                                    </a-space>
                                </div>
                            </div>
                        </a-card>
                    </a-list-item>
                </template>
            </a-list>
        </a-spin>
    </a-card>
</template>

<script setup>
// ============================================
// IMPORTS
// ============================================

// Vue Core
import { computed, onBeforeUnmount, onMounted } from 'vue';

// Third-party Libraries
import dayjs from 'dayjs';
import { Empty } from 'ant-design-vue';

// Stores
import { useAnnouncementsStore } from '@/store/announcement/announcements.pinia';
import { useAuth } from '@/store/auth/auth.pinia';

// Icons
import IconAnnouncement from '@/components/icon/menu-icons/IconAnnouncement.vue';
import IconClock from '@/components/icon/IconClock.vue';
import IconPlus from '@/components/icon/IconPlus.vue';

// ============================================
// STORE INITIALIZATION
// ============================================

const announcementsStore = useAnnouncementsStore();
const authStore = useAuth();

// ============================================
// COMPUTED PROPERTIES
// ============================================

/**
 * Foydalanuvchi roliga qarab route nomini aniqlash
 * @returns {string} Route nomi
 */
const announcementsRouteName = computed(() => {
    const role = authStore.userRole;
    
    switch (role) {
        case 'ADMIN':
            return 'Announcements';
        case 'STUDENT':
            return 'StudentAnnouncements';
        case 'TEACHER':
            return 'TeacherAnnouncements';
        case 'PARENT':
            return 'ParentAnnouncements';
        default:
            // Agar role aniqlanmagan bo'lsa, default sifatida admin route'ni qaytaradi
            // Lekin bu holatda guard'lar to'sib qo'yishi kerak
            return 'Announcements';
    }
});

/**
 * Admin ekanligini tekshirish (UI uchun)
 * @returns {boolean} Admin bo'lsa true
 */
const isAdmin = computed(() => {
    return authStore.userRole === 'ADMIN';
});

/**
 * Eng so'nggi e'lonlar ro'yxati (4 ta)
 * @returns {Array} E'lonlar ro'yxati
 */
const announcements = computed(() => announcementsStore.getLatestAnnouncements(4));

/**
 * Jami e'lonlar soni
 * @returns {number} E'lonlar soni
 */
const announcementsCount = computed(() => announcementsStore.getAnnouncementsCount);

/**
 * Yuklanish holati
 * @returns {boolean} Yuklanayotgan bo'lsa true
 */
const isLoading = computed(() => announcementsStore.isLoading);

// ============================================
// METHODS
// ============================================

/**
 * Sanani formatlash
 * @param {string|Date} date - Formatlanadigan sana
 * @returns {string} Formatlangan sana (DD.MM.YYYY)
 */
const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('DD.MM.YYYY');
};

// ============================================
// LIFECYCLE HOOKS
// ============================================

/**
 * Component mount bo'lganda e'lonlarni yuklash
 */
onMounted(async () => {
    await announcementsStore.fetchLatestAnnouncements(4);
});

/**
 * Component unmount bo'lganda store'ni tozalash
 */
onBeforeUnmount(() => {
    // Faqat dashboard'dan chiqib ketganda tozalash
    announcementsStore.clearAnnouncements();
});
</script>

<style scoped>

</style>