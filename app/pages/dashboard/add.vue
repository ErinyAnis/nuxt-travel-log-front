<script lang="ts" setup>
import { FetchError } from "ofetch";
import { toTypedSchema } from "@vee-validate/zod";
import { InsertLocation } from "~/lib/db/schema";
import { CENTER_USA } from "~/lib/constants";

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const mapStores = useMapStore();
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
    validationSchema: toTypedSchema(InsertLocation as any)
});

const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = "";
        loading.value = true;
        await $csrfFetch("/api/locations", {
            method: "POST",
            body: values
        });
        submitted.value = true;
        navigateTo('/dashboard');
    } catch (e) {
        const error = e as FetchError;
        if (error.data?.data) {
            setErrors(error.data?.data);
        }

        submitError.value = error.data?.statusMessage || error.statusMessage || "An error occurred while adding the location.";
    }
    loading.value = false;
});

effect(() => {
    if (mapStores.addedPoint) {
        setFieldValue('lat', mapStores.addedPoint.lat);
        setFieldValue('long', mapStores.addedPoint.long);
    }
})

function formatNumber(value?: number) {
    if (!value) return 0;
    return value.toFixed(5);
}

onMounted(() => {
    mapStores.addedPoint = {
        name: "Added Point",
        description: "",
        id: 1,
        lat: CENTER_USA[1],
        long: CENTER_USA[0],
    }
});

onBeforeRouteLeave(() => {
    if (!submitted.value && meta.value.dirty) {
        const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
        if (!confirm) {
            return false;
        }
    }
    mapStores.addedPoint = null;
    return true;
});
</script>

<template>
    <div class="container max-w-md mx-auto p-4">
        <div class="my-4">
            <h1 class="text-xl">Add Location</h1>
            <p class="text-sm">A location is a place you have traveled or will travel to. It can be a city, country,
                state or point of interest. You can add specific times you visited this location after adding it.</p>
        </div>
        <div v-if="submitError" role="alert" class="alert alert-error">
            <span>{{ submitError }}</span>
        </div>
        <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
            <AppFormField label="Name" name="name" :error="errors.name" :disabled="loading" />
            <AppFormField label="Description" name="description" :error="errors.description" type="textarea"
                :disabled="loading" />

            <p>
                Drag your marker
                <Icon name="tabler:map-pin-filled" class="text-warning" /> to your desired location.
            </p>

            <p class="text-sm text-gray-400">
                Current location: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
            </p>

            <!-- <AppFormField label="Latitude" name="lat" :error="errors.lat" type="number" :disabled="loading" />
            <AppFormField label="Longitude" name="long" :error="errors.long" type="number" :disabled="loading" /> -->

            <div class="flex justify-end gap-2 mt-3">
                <button :disabled="loading" type="button" class="btn btn-outline" @click="router.back()">
                    <Icon name="tabler:arrow-left" size="24" />Cancel
                </button>
                <button :disabled="loading" type="submit" class="btn btn-primary">Add
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                    <Icon v-else name="tabler:circle-plus-filled" size="24" />
                </button>
            </div>
        </form>
    </div>
</template>