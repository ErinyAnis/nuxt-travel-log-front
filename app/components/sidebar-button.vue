<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';


const props = defineProps<{
    label: string;
    icon: string;
    href?: string;
    to?: RouteLocationRaw;
    showLabel: boolean;
    iconColor?: 'text-accent' | 'text-primary' | 'text-secondary';
}>();

const route = useRoute();

const link = computed(() => {
    if (typeof props.to === 'object' && 'params' in props.to) {
        const params = props.to.params as Record<string, unknown>;

        if ('slug' in params && !params.slug) {
            return undefined;
        }
    }

    return props.href || props.to;
});
</script>

<template>
    <div class="tooltip-right" :data-tip="showLabel ? undefined : props.label" :class="{ tooltip: !showLabel }">
        <div class="tooltip-right" :data-tip="showLabel ? undefined : props.label" :class="{ tooltip: !showLabel }">

            <NuxtLink v-if="link" :to="link"
                :class="{ 'bg-base-200': route.path === props.href, 'justify-center': !showLabel, 'justify-start': showLabel }"
                class="flex btn gap-2 p-2 hover:bg-base-300 hover:cursor-pointer bg-base-100 shadow-none border-0 flex-nowrap">

                <span class="max-w-6">
                    <Icon :name="props.icon" size="24" :class="iconColor" />
                </span>

                <Transition name="grow">
                    <span v-if="showLabel" class="mb-1 truncate" :class="iconColor">
                        {{ props.label }}
                    </span>
                </Transition>

            </NuxtLink>

        </div>
    </div>
</template>

<style scoped>
.grow-enter-active {
    transition: grow 0.1s;
}

.grow-leave-active {
    animation: grow 0.2s reverse;
}

@keyframes grow {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}
</style>