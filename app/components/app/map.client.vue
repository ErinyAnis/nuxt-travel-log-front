<script lang="ts" setup>
import type { MglEvent } from '@indoorequal/vue-maplibre-gl';
import type { LngLat, MapMouseEvent } from 'maplibre-gl';
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

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
    if (mapStore.addedPoint) {
        mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
        mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
    }
}

onMounted(() => {
    mapStore.init();
});
</script>

<template>
    <div class="w-full h-full" :class="{ 'dark-popup-mode': isDark }">
        <MglMap :map-style="style" :center="CENTER_USA" :zoom="zoom" @map:dblclick="onDoubleClick"
            :container-style="{ height: '100%', width: '100%' }">
            <MglNavigationControl />
            <MglMarker v-if="mapStore.addedPoint" draggable
                :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
                @update:coordinates="updateAddedPoint">
                <template v-slot:marker>
                    <div class="tooltip tooltip-top tooltip-open hover:cursor-pointer"
                        data-tip="Drag to your desired location">
                        <Icon name="tabler:map-pin-filled" size="35" class="text-warning" />
                    </div>
                </template>

            </MglMarker>
            <MglMarker v-for="point in mapStore.mapPoints" :key="point.id" :coordinates="[point.long, point.lat]">
                <template v-slot:marker>
                    <div class="tooltip tooltip-top hover:cursor-pointer" :data-tip="point.name" :class="{
                        'tooltip-open': mapStore.selectedPoint === point
                    }" @mouseenter="mapStore.selectedPoint = point" @mouseleave="mapStore.selectedPoint = null">
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
