<script lang="ts" setup>
import type { MapPoint } from '~/lib/types';

defineProps<{
    mapPoint: MapPoint;
}>();

const mapStore = useMapStore();
</script>

<template>
    <NuxtLink :to="mapPoint.to" class="card card-compact bg-base-300 h-40 border-2 w-72 mb-2 shrink-0 cursor-pointer"
        :class="{
            'border-accent': isPointSelected(mapPoint, mapStore.selectedPoint),
            'border-transparent': !isPointSelected(mapPoint, mapStore.selectedPoint)
        }" @mouseenter="mapStore.selectedPoint = mapPoint" @mouseleave="mapStore.selectedPoint = null">
        <div class="card-body min-h-0 p-5">
            <slot name="top" />
            <h3 class="text-lg font-semibold max-h-6 overflow-hidden text-ellipsis">{{ mapPoint.name }}</h3>
            <p class="text-sm line-clamp-4 overflow-hidden">{{ mapPoint.description }}</p>
        </div>
    </NuxtLink>
</template>