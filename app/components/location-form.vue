<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import type { NominatimResult } from "~/lib/types";
import { CENTER_USA } from "~/lib/constants";
import { InsertLocation, type InsertLocationType } from "~/lib/db/schema";

const props = defineProps<{
    initialValues?: InsertLocationType | null;
    onSubmit: (location: InsertLocationType) => Promise<any>;
    onSubmitComplete: () => void;
    submitLabel: string;
    submitIcon: string;
}>();

const router = useRouter();
const mapStores = useMapStore();

import { FetchError } from "ofetch";


const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const isConfirmDialogOpen = ref(false);
let resolveConfirm: ((value: boolean) => void) | null = null;

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
    validationSchema: toTypedSchema(InsertLocation as any),
    initialValues: {
        name: props.initialValues?.name || "",
        description: props.initialValues?.description || "",
        lat: props.initialValues?.lat || CENTER_USA[1],
        long: props.initialValues?.long || CENTER_USA[0],
    }
});

const onSubmit = handleSubmit(
    async (values: InsertLocationType) => {
        try {
            submitError.value = "";
            loading.value = true;
            await props.onSubmit(values);
            submitted.value = true;
            props.onSubmitComplete();
        } catch (e) {
            const error = e as FetchError;
            if (error.data?.data) {
                setErrors(error.data?.data);
            }
            submitError.value = getFetchErrorMessage(error);
        }
        loading.value = false;
    }
);

function formatNumber(value?: number) {
    if (!value) return 0;
    return value.toFixed(5);
}

effect(() => {
    if (mapStores.addedPoint) {
        setFieldValue('lat', mapStores.addedPoint.lat);
        setFieldValue('long', mapStores.addedPoint.long);
    }
})

function searchResultSelected(result: NominatimResult) {
    setFieldValue('name', result.display_name);
    mapStores.addedPoint = {
        name: "Added Point",
        description: "",
        id: 1,
        lat: Number(result.lat),
        long: Number(result.lon),
        centerMap: true
    }
}

onMounted(() => {
    mapStores.addedPoint = {
        name: "Added Point",
        description: "",
        id: 1,
        lat: props.initialValues?.lat || CENTER_USA[1],
        long: props.initialValues?.long || CENTER_USA[0],
    }
});

function openConfirmDialog(): Promise<boolean> {
    isConfirmDialogOpen.value = true;
    return new Promise((resolve) => {
        resolveConfirm = resolve;
    });
}

function onDialogClosed(confirmed: boolean) {
    isConfirmDialogOpen.value = false;
    resolveConfirm?.(confirmed);
    resolveConfirm = null;
}

onBeforeRouteLeave(async () => {
    if (!submitted.value && meta.value.dirty) {
        const confirm = await openConfirmDialog();
        if (!confirm) return false;
    }
    mapStores.addedPoint = null;
    return true;
});
</script>

<template>
    <div class="p-3">
        <div v-if="submitError" role="alert" class="alert alert-error">
            <span>{{ submitError }}</span>
        </div>
        <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
            <AppFormField label="Name" name="name" :error="errors.name" :disabled="loading" />
            <AppFormField label="Description" name="description" :error="errors.description" type="textarea"
                :disabled="loading" />

            <p class="text-sm text-gray-400">
                Current coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
            </p>
            <p>To set the coordinates:</p>
            <ul class="list-disc ml-4 text-sm">
                <li>
                    Drag your marker
                    <Icon name="tabler:map-pin-filled" class="text-warning" /> on the map.
                </li>
                <li>Double click the map.</li>
                <li>Search for a location below.</li>
            </ul>


            <div class="flex justify-end gap-2 mt-3">
                <button :disabled="loading" type="button" class="btn btn-outline" @click="router.back()">
                    <Icon name="tabler:arrow-left" size="24" />Cancel
                </button>
                <button :disabled="loading" type="submit" class="btn btn-primary">{{ props.submitLabel }}
                    <span v-if="loading" class="loading loading-spinner loading-sm" />
                    <Icon v-else :name="props.submitIcon" size="24" />
                </button>
            </div>
        </form>
        <div class="divider" />
        <AppPlaceSearch @results-selected="searchResultSelected" />
    </div>
    <AppDialog title="Are you sure?" description="Are you sure you want to leave? All unsaved changes will be lost."
        confirm-label="Yes, leave!" confirm-class="btn-warning" :is-open="isConfirmDialogOpen"
        @on-confirmed="onDialogClosed(true)" @on-closed="onDialogClosed(false)" />
</template>