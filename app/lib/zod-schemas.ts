import { z } from 'zod';

export const SearchSchema = z.object({
    q: z.string().min(1, { message: 'You must enter a search term' }),
});

export type SearchSchemaType = z.infer<typeof SearchSchema>;

export const NameSchema = (field: any) => field.min(1, "Required").max(100);
export const DescriptionSchema = (field : any) => field.max(1000);
export const LatSchema = (field : any) => field.min(-90).max(90);
export const LongSchema = (field : any) => field.min(-180).max(180);