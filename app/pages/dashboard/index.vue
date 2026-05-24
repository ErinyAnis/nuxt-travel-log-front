<script lang="ts" setup>
const locationStore = useLocationStore();
const mapStore = useMapStore();
const { locations, locationsStaus: status } = storeToRefs(locationStore);

onMounted(() => {
    locationStore.refreshLocations();
});
</script>

<template>
    <div class="p-4 min-h-64">
        <h2 class="text-2xl">Locations</h2>

        <div v-if="status === 'pending'">
            <span class="loading loading-spinner loading-xl"></span>
        </div>

        <div v-else-if="locations && locations.length > 0" class="location-list custom-scrollbar">
            <LocationCard v-for="location in locations" :key="location.id"
                :mapPoint="createMapPointFromLocation(location)" />
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
