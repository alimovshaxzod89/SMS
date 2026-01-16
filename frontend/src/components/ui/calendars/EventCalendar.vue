<template>
    <a-card :bordered="false" class="shadow-sm">
        <template #title>
            <a-space>
                <IconFlag class="w-5 h-5 text-blue-500" />
                <span>Taqvim</span>
            </a-space>
        </template>
        
        <a-calendar 
            v-model:value="selectedDate" 
            :fullscreen="false" 
            @panelChange="onPanelChange"
            @select="onSelectDate"
        />
        
        <a-divider />
        
        <div class="flex justify-between items-center mb-4">
            <a-space>
                <IconClock class="w-5 h-5" />
                <a-typography-title :level="5" class="!mb-0">
                    Voqealar
                </a-typography-title>
                <a-badge :count="filteredEvents.length" />
            </a-space>
            <a-dropdown>
                <a-button type="text" size="small" shape="circle">
                    <IconMore />
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1" @click="emit('addEvent')">
                            <IconPlus class="w-4 h-4 inline mr-2" />
                            Yangi voqea
                        </a-menu-item>
                        <router-link :to="{ name: 'Events' }">
                            <a-menu-item key="2">
                                <IconEye class="w-4 h-4 inline mr-2" />
                                Barchasini ko'rish
                            </a-menu-item>
                        </router-link>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>

        <!-- Loading State -->
        <a-spin :spinning="eventsStore.isLoading" tip="Voqealar yuklanmoqda...">
            <!-- Events Timeline -->
            <a-timeline v-if="filteredEvents.length > 0" mode="left">
                <a-timeline-item 
                    v-for="(event, index) in filteredEvents" 
                    :key="event._id || event.id"
                    :color="index % 2 === 0 ? 'blue' : 'purple'"
                >
                    <template #dot>
                        <IconClockCheck class="w-4 h-4" />
                    </template>
                    
                    <a-card 
                        size="small" 
                        :bordered="false"
                        :class="index % 2 === 0 ? 'bg-blue-50' : 'bg-purple-50'"
                    >
                        <div class="flex items-start justify-between gap-2">
                            <a-space direction="vertical" :size="2" class="flex-1">
                                <a-typography-text strong class="text-gray-700">
                                    {{ event.title }}
                                </a-typography-text>
                                <a-typography-text type="secondary" class="text-xs">
                                    {{ event.description }}
                                </a-typography-text>
                            </a-space>
                        </div>
                        <a-tag color="blue" size="small" class="mt-2">
                            <template #icon>
                                <IconClock class="w-3 h-3" />
                            </template>
                            {{ formatEventTime(event) }}
                        </a-tag>
                    </a-card>
                </a-timeline-item>
            </a-timeline>

            <!-- Empty State -->
            <a-empty 
                v-else 
                :description="selectedDate ? 'Tanlangan sanada voqealar mavjud emas' : 'Voqealar topilmadi'"
                :image="Empty.PRESENTED_IMAGE_SIMPLE"
            />
        </a-spin>
    </a-card>
</template>

<script setup>
// ============================================
// IMPORTS
// ============================================

// Vue Core
import { computed, onMounted, ref } from 'vue';

// Third-party Libraries
import dayjs from 'dayjs';
import { Empty } from 'ant-design-vue';

// Stores
import { useEventsStore } from '@/store/event/events.pinia';

// Icons
import IconClock from '@/components/icon/IconClock.vue';
import IconClockCheck from '@/components/icon/IconClockCheck.vue';
import IconEye from '@/components/icon/IconEye.vue';
import IconFlag from '@/components/icon/IconFlag.vue';
import IconMore from '@/components/icon/IconMore.vue';
import IconPlus from '@/components/icon/IconPlus.vue';

// ============================================
// EMITS
// ============================================

const emit = defineEmits(['addEvent']);

// ============================================
// STORE INITIALIZATION
// ============================================

const eventsStore = useEventsStore();

// ============================================
// REACTIVE STATE
// ============================================

const selectedDate = ref(dayjs());

// ============================================
// COMPUTED PROPERTIES
// ============================================

/**
 * Tanlangan sanaga mos keladigan voqealar
 * @returns {Array} Filterlangan voqealar ro'yxati
 */
const filteredEvents = computed(() => {
    if (!selectedDate.value) {
        return eventsStore.getEvents;
    }
    
    return eventsStore.getFilteredEventsByDate(selectedDate.value);
});

// ============================================
// METHODS
// ============================================

/**
 * Event vaqtini formatlash
 * @param {Object} event - Event obyekti
 * @returns {string} Formatlangan vaqt
 */
const formatEventTime = (event) => {
    if (!event.startTime || !event.endTime) {
        return 'Vaqt ko\'rsatilmagan';
    }

    const start = dayjs(event.startTime);
    const end = dayjs(event.endTime);

    return `${start.format('HH:mm')} - ${end.format('HH:mm')}`;
};

/**
 * Calendar panel o'zgarganda (oy yoki yil o'zgarganda)
 * @param {dayjs.Dayjs} value - Yangi sana
 * @param {string} mode - 'month' yoki 'year'
 */
const onPanelChange = async (value, mode) => {
    // Oylik tadbirlarni yuklash
    await eventsStore.fetchEventsByMonth(value);
};

/**
 * Calendar'dan sana tanlanganda
 * @param {dayjs.Dayjs} date - Tanlangan sana
 */
const onSelectDate = async (date) => {
    selectedDate.value = date;
    
    // Store'ga tanlangan sanani saqlash
    eventsStore.setSelectedDate(date);
};

// ============================================
// LIFECYCLE HOOKS
// ============================================

/**
 * Component mount bo'lganda oylik tadbirlarni yuklash
 */
onMounted(async () => {
    // Avval oylik tadbirlarni yuklash
    await eventsStore.fetchEventsByMonth(selectedDate.value);
    
    // Keyin bugungi sana bo'yicha filter qilish
    eventsStore.setSelectedDate(selectedDate.value);
});
</script>

<style scoped>
:deep(.ant-picker-calendar-header) {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 10px !important;
    border-bottom: 1px solid #d9d9d9 !important;
}
</style>