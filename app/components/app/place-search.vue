<script lang="ts" setup>
import { SearchSchema, type SearchSchemaType } from '~/lib/zod-schemas';
import { toTypedSchema } from '@vee-validate/zod';
import type { NominatimResult } from '~/lib/types';
import { FetchError } from "ofetch";

const emit = defineEmits<{
    resultsSelected: [result: NominatimResult]
}>();

const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

async function onSubmit(query: Record<string, string>) {
    try {
        loading.value = true;
        hasSearched.value = true;
        errorMessage.value = "";
        searchResults.value = [];
        const results = await $fetch('/api/search', {
            query,
        });
        searchResults.value = results;
    } catch (e) {
        const error = e as FetchError;
        errorMessage.value = getFetchErrorMessage(error);
    }
    loading.value = false;
}

function setLocation(result: NominatimResult) {
    emit('resultsSelected', result);
    searchResults.value = [];
    errorMessage.value = "";
    hasSearched.value = false;
    if (form.value) {
        form.value.resetForm();
    }
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <Form ref="form" v-slot="{ errors, submitCount }" class="flex flex-col gap-2 items-center"
            :validation-schema="toTypedSchema(SearchSchema)" :initial-values="{ q: '' }" @submit="onSubmit">
            <div class="join mt-2">
                <div>
                    <label class="input join-item">
                        <Icon name="tabler:search" size="24" />
                        <Field type="text" name="q" placeholder="Search for a location" :disabled="loading"
                            :class="{ 'input-error': errors.q }" />
                    </label>
                    <p v-if="errors.q && submitCount > 0" class="mt-1 text-error text-sm fieldset-label">
                        {{ errors.q }}
                    </p>
                </div>
                <button class="btn btn-neutral join-item" :disabled="loading" type="submit">Search</button>
            </div>
        </Form>

        <div v-if="!loading && hasSearched && !searchResults.length" role="alert" class="alert alert-warning mt-2">
            <span class="flex items-center gap-2">
                <Icon name="tabler:alert-circle" size="22" /> No results found
            </span>
        </div>

        <div v-if="!loading && errorMessage" role="alert" class="alert alert-error mt-2">
            <span class="flex items-center gap-2">
                <Icon name="tabler:alert-circle" size="22" /> {{ errorMessage }}
            </span>
        </div>

        <div v-if="loading" class="flex justify-center mt-2">
            <div class="loading loading-lg"></div>
        </div>



        <div class="flex flex-col gap-2 overflow-auto max-h-60 custom-scrollbar mt-2">
            <div class="card card-sm bg-base-100" v-for="result in searchResults" :key="result.place_id">
                <div class="card-body">
                    <h4 class="card-title">{{ result.display_name }}</h4>
                    <div class="card-actions justify-end">
                        <button class="btn btn-warning btn-sm" @click="setLocation(result)">Set Location
                            <Icon name="tabler:map-pin-share" size="20" />
                        </button>
                    </div>
                </div>

            </div>
        </div>


    </div>

</template>