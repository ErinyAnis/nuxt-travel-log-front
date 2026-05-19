<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>

<template>
    <button :disabled="authStore.loading" class="btn btn-accent" @click="authStore.signIn">Sign In With GitHub
        <span v-if="authStore.loading" class="loading loading-spinner loading-md"></span>
        <Icon name="tabler:brand-github" size="24" />
    </button>
</template>