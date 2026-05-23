<script lang="ts" setup>
const locationStore = useLocationStore();
const mapStore = useMapStore();
const { locations, status } = storeToRefs(locationStore);

onMounted(() => {
    locationStore.refresh();
});
</script>

<template>
    <div class="p-4">
        <h2 class="text-2xl">Locations</h2>

        <div v-if="status === 'pending'">
            <span class="loading loading-spinner loading-xl"></span>
        </div>

        <div v-else-if="locations && locations.length > 0"
            class="flex flex-nowrap my-4 gap-2 overflow-x-auto overflow-y-hidden custom-scrollbar py-3">
            <div v-for="location in locations" :key="location.id"
                class="card card-compact bg-base-300 h-40 border-2 w-72 mb-2 shrink-0 cursor-pointer" :class="{
                    'border-accent': location.id === mapStore.selectedPoint?.id,
                    'border-transparent': location.id !== mapStore.selectedPoint?.id
                }" @mouseenter="mapStore.selectedPoint = location" @mouseleave="mapStore.selectedPoint = null">
                <div class="card-body">
                    <h3 class="text-xl">{{ location.name }}</h3>
                    <p class="text-sm line-clamp-4">{{ location.description }}</p>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-2 mt-4">
            <p>Add a location to get started.</p>
            <div>
                <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
                    <Icon name="tabler:circle-plus-filled" size="24" />
                    Add Location
                </NuxtLink>
            </div>
        </div>


    </div>

</template>
