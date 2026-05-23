import { z } from 'zod';

export const SearchSchema = z.object({
    q: z.string().min(1, { message: 'You must enter a search term' }),
});

export type SearchSchemaType = z.infer<typeof SearchSchema>;