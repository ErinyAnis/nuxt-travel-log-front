import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "~/lib/env";
import createS3Client from "~/utils/create-s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const key = getQuery(event).key as string;

    if (!key) {
        return sendError(event, createError({ statusCode: 400, statusMessage: "Key is required" }));
    }

    const client = createS3Client();
    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return { url };
});