import { listUserGroups } from "~~/lib/db/queries/groups";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;

    const userGroups = await listUserGroups(userId);

    return userGroups;
});