<script lang="ts" setup>
const locationStore = useLocationStore();
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
            class="flex flex-nowrap mt-4 gap-2 overflow-x-auto overflow-y-hidden custom-scrollbar ">
            <div v-for="location in locations" class="card card-compact bg-base-300 h-40 w-72 shrink-0"
                :key="location.id">
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

<style scoped>
/* Custom scrollbar style */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 #e2e8f0;
}

.custom-scrollbar::-webkit-scrollbar {
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #e2e8f0;
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}

/* For dark mode (if you're using dark mode) */
.dark .custom-scrollbar::-webkit-scrollbar-track {
    background: #1f2937;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
}
</style>
الحل 3: Style أنيق وأكثر جمالاً (Modern)
vue
<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
    padding-bottom: 4px;
}

.custom-scrollbar::-webkit-scrollbar {
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 9999px;
    margin: 0 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #cbd5e1, #94a3b8);
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, #94a3b8, #64748b);
}

/* Dark mode */
.dark .custom-scrollbar {
    scrollbar-color: #334155 #1e293b;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
    background: #1e293b;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #334155, #475569);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, #475569, #64748b);
}
</style>
