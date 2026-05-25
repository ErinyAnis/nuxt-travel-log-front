<script lang="ts" setup>
const route = useRoute();
const locationStore = useLocationStore();
const {
    currentLocationLog: locationLog,
    currentLocationLogStatus: status,
    currentLocationLogError: error }
    = storeToRefs(locationStore);

const loading = computed(() => status.value === 'pending');
const errorMessage = computed(() => error.value?.statusMessage);

onMounted(() => {
    locationStore.refreshCurrentLocationLog();
})
</script>

<template>
    <div class="page-content-top">
        <div v-if="loading">
            <div class="loading" />
        </div>

        <div v-if="errorMessage && !loading" class="alert alert-error">
            <p>{{ errorMessage }}</p>
        </div>

        <div v-if="route.name === 'dashboard-location-slug-id' && locationLog && !loading">
            <p class="text-sm italic text-gray-500">
                <span v-if="locationLog.startedAt !== locationLog.endedAt">
                    {{ formatDate(locationLog.startedAt) }} / {{ formatDate(locationLog.endedAt) }}
                </span>
                <span v-else>
                    {{ formatDate(locationLog.startedAt) }}
                </span>
            </p>
            <div class="flex items-center">
                <h2 class="text-xl">{{ locationLog.name }}</h2>
            </div>

            <div class="max-w-xl">
                <p class="text-sm">{{ locationLog.description }}</p>
            </div>
            <NuxtPage />
        </div>
    </div>

</template>