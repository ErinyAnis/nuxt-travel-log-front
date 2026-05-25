import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~/lib/constants";
import type { SelectLocationWithLogs, SelectLocationLog } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

export const useLocationStore = defineStore("useLocationStore", () => {
    const route = useRoute();

    const { data: locations, status: locationsStatus, refresh: refreshLocations } = useFetch('/api/locations', {
        lazy: true,
    });

    const locationUrlWithSlug = computed(() => {
        const slug = route.params.slug;

        if (!slug || typeof slug !== 'string') {
            return null;
        }

        return `/api/locations/${slug}`;
    });

    const locationLogUrlWithSlugAndId = computed(() => {
    const slug = route.params.slug;
    const id = route.params.id;

    if (
        !slug || typeof slug !== 'string' ||
        !id || typeof id !== 'string'
    ) {
        return null;
    }

    return `/api/locations/${slug}/${id}`;
});

    const {
        data: currentLocation,
        status: currentLocationStatus,
        error: currentLocationError,
        refresh: refreshCurrentLocation,
    } = useFetch<SelectLocationWithLogs>(() => locationUrlWithSlug.value ?? '', {
        lazy: true,
        immediate: false,
        watch: [locationUrlWithSlug],
    });

    const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
} = useFetch<SelectLocationLog>(
    () => locationLogUrlWithSlugAndId.value ?? '',
    {
        lazy: true,
        immediate: false,
        watch: [locationLogUrlWithSlugAndId],
    }
);

    const sidebarStore = useSidebarStore();
    const mapStore = useMapStore();

    effect(() => {
        if (locations.value && LOCATION_PAGES.has(route.name?.toString() || '')) {
            const mapPoints: MapPoint[] = [];
            const sidebarItems: SidebarItem[] = [];

            locations.value.forEach((location) => {
                const mapPoint = createMapPointFromLocation(location);
                sidebarItems.push({
                    id: `location-${location.id}`,
                    label: location.name,
                    icon: 'tabler:map-pin',
                    to: { name: 'dashboard-location-slug', params: { slug: location.slug } },
                    mapPoint,
                });
                mapPoints.push(mapPoint);
            })

            sidebarStore.sidebarItems = sidebarItems;
            mapStore.mapPoints = mapPoints;
        }
        else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
            const mapPoints: MapPoint[] = [];
            const sidebarItems: SidebarItem[] = [];

            if (!currentLocation.value.slug) return;

            const slug = currentLocation.value.slug;

            if (!slug) return;

            currentLocation.value.locationLogs.forEach((log) => {
                const mapPoint = createMapPointFromLocationLog(log, slug);

                sidebarItems.push({
                    id: `location-log-${log.id}`,
                    label: log.name,
                    icon: "tabler:map-pin-filled",
                    to: {
                        name: "dashboard-location-slug-id",
                        params: {
                            slug,
                            id: log.id
                        }
                    },
                    mapPoint,
                });

                mapPoints.push(mapPoint);
            });

            sidebarStore.sidebarItems = sidebarItems;
            if (mapPoints.length) {
                mapStore.mapPoints = mapPoints;
            }
            else {
                mapStore.mapPoints = [currentLocation.value];
            }
        }

        else if (currentLocationLog.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
            sidebarStore.sidebarItems = [];
            mapStore.mapPoints = [currentLocationLog.value];
        }

        sidebarStore.loading =
            locationsStatus.value === 'pending' ||
            currentLocationStatus.value === 'pending';

        if (sidebarStore.loading) {
            mapStore.mapPoints = [];
        }
    });

    return {
        locations,
        locationsStatus,
        refreshLocations,
        currentLocation,
        currentLocationStatus,
        currentLocationError,
        refreshCurrentLocation,
        currentLocationLog,
        currentLocationLogStatus,
        currentLocationLogError,
        refreshCurrentLocationLog
    };
});