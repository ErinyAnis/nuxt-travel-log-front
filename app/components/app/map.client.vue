<script lang="ts" setup>
import type { LngLat } from 'maplibre-gl';
import { CENTER_USA } from '~/lib/constants';

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');
const mapStore = useMapStore();

// const style = 'https://tiles.openfreemap.org/styles/liberty?key=yC4AXZ0CmAmHyBtjGrwR';
// const style = '/styles/dark.json';
const style = computed(() => colorMode.value === 'dark' ? '/styles/dark.json' : 'https://tiles.openfreemap.org/styles/liberty?key=yC4AXZ0CmAmHyBtjGrwR');
const zoom = 3;

function updateAddedPoint(location: LngLat) {
    if (mapStore.addedPoint) {
        mapStore.addedPoint.long = location.lng;
        mapStore.addedPoint.lat = location.lat;
    }
}

onMounted(() => {
    mapStore.init();
});
</script>

<template>
    <div class="w-full h-full" :class="{ 'dark-popup-mode': isDark }">
        <MglMap :map-style="style" :center="CENTER_USA" :zoom="zoom"
            :container-style="{ height: '100%', width: '100%' }">
            <MglNavigationControl />
            <MglMarker v-if="mapStore.addedPoint" draggable :coordinates="CENTER_USA"
                @update:coordinates="updateAddedPoint">
                <template v-slot:marker>
                    <div class="tooltip tooltip-top hover:cursor-pointer" data-tip="Drag to your desired location">
                        <Icon name="tabler:map-pin-filled" size="35" class="text-warning" />
                    </div>
                </template>

            </MglMarker>
            <MglMarker v-for="point in mapStore.mapPoints" :key="point.id" :coordinates="[point.long, point.lat]">
                <template v-slot:marker>
                    <div class="tooltip tooltip-top hover:cursor-pointer" :data-tip="point.name" :class="{
                        'tooltip-open': mapStore.selectedPoint === point
                    }" @mouseenter="mapStore.selectedPointWithFlyTo(point)"
                        @mouseleave="mapStore.selectedPointWithFlyTo(null)">
                        <Icon name="tabler:map-pin-filled" size="32"
                            :class="mapStore.selectedPoint === point ? 'text-accent' : 'text-secondary'" />
                    </div>
                </template>
                <MglPopup>
                    <h3 class="text-xl">{{ point.name }}</h3>
                    <p v-if="point.description">{{ point.description }}</p>
                </MglPopup>
            </MglMarker>
        </MglMap>
    </div>
</template>
