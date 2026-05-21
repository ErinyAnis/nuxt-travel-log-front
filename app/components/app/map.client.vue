<script lang="ts" setup>
import { CENTER_USA } from '~/lib/constants';

const colorMode = useColorMode();

// const style = 'https://tiles.openfreemap.org/styles/liberty?key=yC4AXZ0CmAmHyBtjGrwR';
// const style = '/styles/dark.json';
const style = computed(() => colorMode.value === 'dark' ? '/styles/dark.json' : 'https://tiles.openfreemap.org/styles/liberty?key=yC4AXZ0CmAmHyBtjGrwR');
const zoom = 3;
</script>

<template>
    <div class="w-full h-full">
        <MglMap :map-style="style" :center="CENTER_USA" :zoom="zoom"
            :container-style="{ height: '100%', width: '100%' }">
            <MglNavigationControl />
        </MglMap>
    </div>
</template>