import { UpdateProject } from '~~/server/lib/db/schema';
import { projectService } from '~~/server/services';
import { ensureOrganizationPermission } from '~~/server/utils/userPermission';

export default defineAuthenticatedEventHandler(async (event) => {
    const projectId = validateRouterParam(event, 'id');
    const body = await validateBody(event, UpdateProject);

    // Check for at least one key, could be updated if we patch more than just the title
    if (!body.title) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad request',
        });
    }

    const project = await projectService.getProjectById(projectId);
    if (!project)
        throw createError({
            statusCode: 404,
            statusMessage: 'Project not found.',
        });

    // This is where we also validate if user has access to org
    await ensureOrganizationPermission(event, project.organizationId, {
        project: ['update'],
    });

    const updated = await projectService.partialUpdate(project.id, project.organizationId, body);
    if (!updated || updated.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Project not found',
        });
    }

    setResponseStatus(event, 204);
});
