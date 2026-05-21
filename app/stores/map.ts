
import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
    const mapPoints = ref<MapPoint[]>([]);
    const selectedPoint = ref<MapPoint | null>(null);
    const addedPoint = ref<MapPoint | null>(null);
    const shouldFlyTo = ref(true);

    function selectedPointWithFlyTo(point: MapPoint | null) {
        shouldFlyTo.value = false;
        selectedPoint.value = point;
    }

    async function init() {
        const { useMap } = await import("@indoorequal/vue-maplibre-gl");
        const { LngLatBounds } = await import("maplibre-gl");
        const map = useMap();

        let bounds: InstanceType<typeof LngLatBounds> | null = null;
        const padding = 50;

        effect(() => {
            const firstpoint = mapPoints.value[0];
            if (!firstpoint)
                return;

            bounds = mapPoints.value.reduce((bounds, point) => {
                return bounds.extend([point.long, point.lat]);

            }, new LngLatBounds(
                [firstpoint.long, firstpoint.lat],
                [firstpoint.long, firstpoint.lat]
            ));

            map.map?.fitBounds(bounds, { padding });
        })

        effect(() => {
            if (addedPoint.value)
                return;
            if (selectedPoint.value) {
                if (shouldFlyTo.value) {
                    map.map?.flyTo({
                        center: [selectedPoint.value.long, selectedPoint.value.lat],
                        zoom: 1.1,
                        speed: 0.8,
                    });
                }
                shouldFlyTo.value = true;
            } else if (bounds) {
                map.map?.fitBounds(bounds, { padding });
            }
        })

    }
    return {
        init,
        mapPoints,
        selectedPoint,
        selectedPointWithFlyTo,
        addedPoint
    };
});