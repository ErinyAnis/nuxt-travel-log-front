<script lang="ts" setup>
import { CENTER_USA } from '~/lib/constants';
import { InsertLocationLog } from '~/lib/db/schema';

const props = defineProps<{
    initialValues?: InsertLocationLog;
    onSubmit: (location: InsertLocationLog) => Promise<any>;
    onSubmitComplete: () => void;
    submitLabel: string;
    submitIcon: string;
}>();

const initialValues = {
    name: '',
    description: '',
    startedAt: Date.now() - 24 * 60 * 60 * 1000,
    endedAt: Date.now(),
    long: (CENTER_USA as [number, number])[0],
    lat: (CENTER_USA as [number, number])[1]
}
</script>

<template>
    <LocationBaseForm :zoom="11" v-slot="{ errors, loading }" :schema="InsertLocationLog"
        :initial-values="props.initialValues || initialValues" :on-submit :on-submit-complete :submit-label
        :submit-icon>
        <AppFormField label="Name" name="name" :error="errors.name" :disabled="loading" />
        <AppFormField label="Description" name="description" :error="errors.description" type="textarea"
            :disabled="loading" />
        <AppDateFormField label="Started At" name="startedAt" :value="initialValues.startedAt" :error="errors.startedAt"
            :disabled="loading" />
        <AppDateFormField label="Ended At" :value="initialValues.endedAt" name="endedAt" :error="errors.endedAt"
            :disabled="loading" />
    </LocationBaseForm>
</template>