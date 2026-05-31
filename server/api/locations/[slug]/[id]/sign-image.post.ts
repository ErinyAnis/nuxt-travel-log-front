import { PutObjectCommand } from "@aws-sdk/client-s3";
import z from "zod";
import env from "~/lib/env";
import createS3Client from "~/utils/create-s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

const MAX_CONTENT_LENGTH = 1024 * 1024 * 5;

const ImageSchema = z.object({
    contentLength: z.number().min(1).max(MAX_CONTENT_LENGTH),
});

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, ImageSchema.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const slug = getRouterParam(event, 'slug') as string;
    const id = getRouterParam(event, 'id') as string;

    await event.$fetch(`/api/locations/${slug}/${id}`);

    const fileName = crypto.randomUUID();
    const key = `${event.context.user.id}/${id}/${fileName}.jpg`;

    return { key };
});