import { projectService } from '~~/server/services';
import { ensureOrganizationPermission } from '~~/server/utils/userPermission';
import { validateRouterParam } from '~~/server/utils/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    const projectId = validateRouterParam(event, 'id');

    const project = await projectService.getProjectById(projectId);
    if (!project)
        throw createError({
            statusCode: 404,
            statusMessage: 'Project not found.',
        });

    // This is where we also validate if user has access to org
    await ensureOrganizationPermission(event, project.organizationId, {
        project: ['delete'],
    });

    const deleted = await projectService.deleteProject(project.id, project.organizationId);
    if (!deleted || deleted.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Project not found',
        });
    }

    setResponseStatus(event, 204);
});
