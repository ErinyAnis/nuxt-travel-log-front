import type { UserWithId } from "./auth";

declare module 'h3' {
    interface H3EventContext {
        user?: UserWithId;
    }
}
export type latLongitem = {
    lat: number;
    long: number;
}

export type MapPoint = {
    id: number;
    label: string;
} & latLongitem