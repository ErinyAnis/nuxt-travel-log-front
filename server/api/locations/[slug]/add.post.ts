import { findLocation } from "~/lib/db/queries/location";
import { InsertLocationLog } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";
import { insertLocationLog } from "~/lib/db/queries/location.log";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug") as string;
    const location = await findLocation(slug, event.context.user.id);

    if(!location) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Location not found."
        }));
    }

    const result = await readValidatedBody(event, InsertLocationLog.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error as any);
    }

    return insertLocationLog(result.data, location.id, event.context.user.id);

});