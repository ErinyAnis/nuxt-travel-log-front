<script setup lang="ts">
import type { SelectLocationLogImage } from '~/lib/db/schema';

defineProps<{
    images: SelectLocationLogImage[];
}>();
</script>

<template>
    <div class="flex mt-2 gap-2 overflow-auto custom-scrollbar">
        <div v-for="image in images" :key="image.id"
            class="card card-compact h-40 w-64 shrink-0 flex justify-center items-center bg-base-300">
            <div class="card-body size-full">
                <img :src="`http://localhost:9000/images/${image.key}`" alt="location log image"
                    class="size-full object-cover" />
            </div>
        </div>
    </div>
</template>