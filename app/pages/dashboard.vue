<script lang="ts" setup>
const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationStore = useLocationStore();
const mapStore = useMapStore();

const { currentLocation } = storeToRefs(locationStore);

onMounted(() => {
    isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
    if (route.path !== '/dashboard') {
        locationStore.refreshLocations();
    }
    effect(() => {
        if (route.name === 'dashboard') {
            sidebarStore.sidebarTopItems = [{
                id: 'link-dashboard', label: 'Locations', icon: 'tabler:map', href: '/dashboard',
            },
            {
                id: 'link-location-add', label: 'Add Location', icon: 'tabler:circle-plus-filled', href: '/dashboard/add',
            }
            ];
        } else if (route.name === "dashboard-location-slug") {
            sidebarStore.sidebarTopItems = [{
                id: 'link-dashboard', label: 'Back to Locations', icon: 'tabler:arrow-left', href: '/dashboard',
            },
            {
                id: 'link-dashboard', label: currentLocation.value ? currentLocation.value.name : 'View Logs', icon: 'tabler:map', to: {
                    name: 'dashboard-location-slug', params: { slug: currentLocation.value?.slug }
                },
            },
            {
                id: 'link-location-edit', label: 'Edit Location', icon: 'tabler:map-pin-cog', to: {
                    name: 'dashboard-location-slug-edit', params: { slug: currentLocation.value?.slug }
                },
            },
            {
                id: 'link-location-add', label: 'Add Location Log', icon: 'tabler:circle-plus-filled', to: {
                    name: 'dashboard-location-slug-add', params: { slug: currentLocation.value?.slug }
                },
            }
            ];
        }
    })

});

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
}
</script>

<template>
    <div class="flex-1 flex">
        <div class="bg-base-100 transition-all duration-300 shrink-0"
            :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
            <div class="flex hover:cursor-pointer hover:bg-base-200 p-2"
                :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
                <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="32" />
                <Icon v-else name="tabler:chevron-right" size="32" />
            </div>
            <div class="flex flex-col">
                <SidebarButton v-for="item in sidebarStore.sidebarTopItems" :key="item.id" :showLabel="isSidebarOpen"
                    :label="item.label" :icon="item.icon" :href="item.href" :to="item.to" />

                <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />

                <div v-if="sidebarStore.loading" class="px-4">
                    <div class="skelton h-4 w-full" />
                </div>

                <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
                    <SidebarButton v-for="item in sidebarStore.sidebarItems" :key="item.id" :showLabel="isSidebarOpen"
                        :label="item.label" :icon="item.icon" :to="item.to"
                        :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
                        @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
                        @mouseleave="mapStore.selectedPoint = null" />
                </div>


                <div class="divider" />
                <SidebarButton :showLabel="isSidebarOpen" label="Sign Out" icon="tabler:logout-2" href="/sign-out" />
            </div>
        </div>
        <div class="flex-1 overflow-auto bg-base-200">
            <div class="flex size-full" :class="{ 'flex-col': route.path !== '/dashboard/add' }">
                <NuxtPage />
                <AppMap class="flex-1" />
            </div>
        </div>
    </div>
</template>