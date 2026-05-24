<script lang="ts" setup>
import { CENTER_USA } from '~/lib/constants';
import { InsertLocation, type InsertLocationType } from '~/lib/db/schema';

const props = defineProps<{
    initialValues?: InsertLocationType;
    onSubmit: (location: InsertLocationType) => Promise<any>;
    onSubmitComplete: () => void;
    submitLabel: string;
    submitIcon: string;
    zoom?: number;
}>();
</script>

<template>
    <LocationBaseForm v-slot="{ errors, loading }" :zoom="props.zoom || 6" :schema="InsertLocation" :initial-values="props.initialValues || {
        name: '',
        description: '',
        long: (CENTER_USA as [number, number])[0],
        lat: (CENTER_USA as [number, number])[1]
    }" :on-submit :on-submit-complete :submit-label :submit-icon>
        <AppFormField label="Name" name="name" :error="errors.name" :disabled="loading" />
        <AppFormField label="Description" name="description" :error="errors.description" type="textarea"
            :disabled="loading" />
    </LocationBaseForm>
</template>