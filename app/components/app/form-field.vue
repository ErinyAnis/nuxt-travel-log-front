<script lang="ts" setup>
const props = defineProps<{
    label: string;
    name: string;
    error?: string;
    type?: "text" | "textarea" | "number";
    disabled?: boolean;
}>();
</script>

<template>
    <fieldset class="fieldset">
        <legend class="legend">{{ props.label }}</legend>

        <Field v-if="type !== 'textarea'" :as="'input'" :name="props.name" :type="type || 'text'" :disabled="disabled"
            class="input w-full" :class="{ 'input-error': props.error }" />

        <Field v-else :as="'textarea'" :name="props.name" :disabled="disabled" class="textarea w-full"
            :class="{ 'input-error': props.error }" rows="4" />

        <p v-if="props.error" class="fieldset-label text-error">{{ props.error }}</p>
    </fieldset>
</template>