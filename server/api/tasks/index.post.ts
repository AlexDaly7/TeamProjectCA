import { auth } from '~~/lib/auth';
import { insertTask } from '~~/lib/db/queries/tasks';
import { InsertTaskClient } from '~~/lib/db/schema';
import { checkCreateIssuePermissions, createIssue } from '~~/server/utils/github';
import { getActiveOrganization } from '~~/server/utils/userPermission';
import { validateBody } from '~~/server/utils/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    // TODO urgent: check they have permissions within the org
    const body = await validateBody(event, InsertTaskClient);

    const org = await getActiveOrganization(event);    

    await ensureUserInOrg(event, event.context.user.id, org.organization.id);

    const token = await getUserGitHubAuthToken(event.context.user.id);

    const permissions = await checkCreateIssuePermissions(token, body.githubRepoOwner, body.githubRepoName);

    if (permissions.canCreate === false) {
        console.log("Failed to create issue in github: ", permissions.reason);
        if (permissions.appHasPermission === false) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Mórchlár lacks  permissions to create issues in this repository. Please authorize Mórchlár to create issues in this repo to continue.',
            });
        } else if (permissions.userHasPermission === false) {
            throw createError({
                statusCode: 403,
                statusMessage: 'You do not have the requied permissions to create issues in this repository. Ensure permissions and try again',
            })
        } else if (permissions.issuesEnabled === false) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Issues are not enabled on this repository.',
            });
        } else {
            throw createError({
                statusCode: 500,
                statusMessage: `Error creating task: ${permissions.reason}`,
            });
        }
    }
    
    // create an issue
    const issue = await createIssue(body.githubRepoOwner, body.githubRepoName, body.title);

    // get issue details
    console.log(issue)

    // // add taks with issue details to db

    // const result = await insertTask(body);
    // if (!result[0] || !result[0].id) {
    //     throw createError({
    //         statusCode: 400,
    //         statusMessage: "Bad Request",
    //         message: "There was a problem inserting task into table."
    //     });
    // }

    // return { id: result[0].id };
});