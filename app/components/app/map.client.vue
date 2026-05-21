<script lang="ts" setup>
import { CENTER_USA } from '~/lib/constants';

const colorMode = useColorMode();
const mapStore = useMapStore();

// const style = 'https://tiles.openfreemap.org/styles/liberty?key=yC4AXZ0CmAmHyBtjGrwR';
// const style = '/styles/dark.json';
const style = computed(() => colorMode.value === 'dark' ? '/styles/dark.json' : 'https://tiles.openfreemap.org/styles/liberty?key=yC4AXZ0CmAmHyBtjGrwR');
const zoom = 3;

onMounted(() => {
    mapStore.init();
});
</script>

<template>
    <div class="w-full h-full">
        <MglMap :map-style="style" :center="CENTER_USA" :zoom="zoom"
            :container-style="{ height: '100%', width: '100%' }">
            <MglNavigationControl />
            <MglMarker v-for="point in mapStore.mapPoints" :key="point.id" :coordinates="[point.long, point.lat]">
                <template v-slot:marker>
                    <div class="tooltip tooltip-top" :data-tip="point.label">
                        <Icon name="tabler:map-pin-filled" size="32" class="text-secondary" />
                    </div>
                </template>
            </MglMarker>
        </MglMap>
    </div>
</template>