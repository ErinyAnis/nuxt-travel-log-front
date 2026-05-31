<script setup lang="ts">
import type { SelectLocationLogImage } from '~/lib/db/schema';
import { FetchError } from "ofetch";

const props = defineProps<{
    images: SelectLocationLogImage[];
}>();

const emit = defineEmits<{
    delete: [image: SelectLocationLogImage];
}>();

const locationStore = useLocationStore();
const route = useRoute();
const isOpen = ref(false);
const isDeleting = ref(false);
const errorMessage = ref("");
const deletingImage = ref<SelectLocationLogImage | null>(null);
const imageUrls = ref<Record<string, string>>({});

async function loadImageUrl(key: string) {
    if (imageUrls.value[key]) return;
    const { url } = await $fetch<{ url: string }>(
        `/api/locations/${route.params.slug}/${route.params.id}/image/image-url`,
        { query: { key } }
    );
    imageUrls.value[key] = url;
}

watch(() => props.images, (images) => {
    images.forEach(img => loadImageUrl(img.key));
}, { immediate: true });

function deleteImage(image: SelectLocationLogImage) {
    deletingImage.value = image;
    isOpen.value = true;
}

function onDialogClose() {
    isOpen.value = false;
    deletingImage.value = null;
}

async function confirmDelete() {
    if (!deletingImage.value) return;
    isOpen.value = false;
    try {
        isDeleting.value = true;
        errorMessage.value = "";
        await $fetch(`/api/locations/${route.params.slug}/${route.params.id}/image/${deletingImage.value?.id}`, {
            method: 'DELETE',
        })
        await locationStore.refreshCurrentLocationLog();
    } catch (e) {
        const error = e as FetchError;
        errorMessage.value = getFetchErrorMessage(error);
    }
    isDeleting.value = false;
    deletingImage.value = null;
}
</script>

<template>
    <div class="flex mt-2 gap-2 overflow-auto custom-scrollbar">
        <div v-for="image in images" :key="image.id" class="card card-compact h-40 w-64 shrink-0 bg-base-300">
            <figure class="relative h-full p-4">
                <img :src="imageUrls[image.key] || ''" alt="location log image" class="size-full object-cover" />
                <div class="absolute bottom-2 right-2">
                    <button :disabled="deletingImage === image && isDeleting" class="btn btn-error btn-sm w-full"
                        @click="deleteImage(image)">
                        Delete
                        <span v-if="deletingImage === image && isDeleting"
                            class="loading loading-spinner loading-xs"></span>
                        <Icon v-else name="tabler:trash-x-filled" size="18" />
                    </button>
                </div>
            </figure>
        </div>
    </div>

    <AppDialog title="Are you sure?" description="Deleting this image cannot be undone. Do you want to continue?"
        confirm-label="Yes, delete this image!" confirm-class="btn-error" :is-open="isOpen" @on-closed="onDialogClose"
        @on-confirmed="confirmDelete" />
</template>