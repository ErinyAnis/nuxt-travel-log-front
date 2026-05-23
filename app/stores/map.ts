
import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
    const mapPoints = ref<MapPoint[]>([]);
    const selectedPoint = ref<MapPoint | null>(null);
    const addedPoint = ref<MapPoint & { centerMap?: boolean } | null>(null);

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

            map.map?.fitBounds(bounds, { padding, maxZoom: 10 });
        })

        watch(addedPoint, (newValue, oldValue) => {
            if ((newValue && !oldValue) || (newValue?.centerMap)) {
                map.map?.flyTo({
                    center: [newValue.long, newValue.lat],
                    zoom: 6,
                    speed: 0.8,
                });
            }
        }, {
            immediate: true
        })
    };

    return {
        init,
        mapPoints,
        selectedPoint,
        addedPoint
    };
});