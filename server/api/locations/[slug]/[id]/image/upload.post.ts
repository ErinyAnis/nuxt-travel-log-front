import { PutObjectCommand } from "@aws-sdk/client-s3";
import env from "~/lib/env";
import createS3Client from "~/utils/create-s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const key = getRouterParam(event, 'key') as string;

    if (!key) {
        return sendError(event, createError({ statusCode: 400, statusMessage: "Key is required" }));
    }

    const body = await readRawBody(event, false) as Buffer;

    const client = createS3Client();
    const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: "image/jpeg",
        Metadata: {
            "user-id": event.context.user.id.toString(),
            // ensure a string is provided (avoid undefined)
            "location-log-id": key.split('/')[1] ?? '',
        },
    });

    await client.send(command);
    return { success: true };
});