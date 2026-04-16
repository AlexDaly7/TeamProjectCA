import { vi, test, describe, beforeEach, expect } from 'vitest';
/*import { ensureOrganizationPermission } from '../../server/utils/userPermission';
import { verifyGitHubRepoAccess } from '../../server/utils/github';
import { getUserGitHubAuthToken } from '../../server/util/auth';
import { createProject } from '../../server/services/projectService';*/

/*vi.mock("~/server/services/projectService ", ()=> ({
    projectService: {
        createProject: vi.fn()
    }
}));

vi.mock("~/server/util/auth", ()=> ({
    getUserGitHubAuthToken: vi.fn()
}));

vi.mock("~/server/utils/userPermission", ()=> ({
    ensureOrganizationPermission: vi.fn()
}));

vi.mock("~/server/utils/github", ()=> ({
    verifyGitHubRepoAccess: vi.fn()
}));*/

vi.mock('../../server/utils/userPermission', () => {
  return {
    ensureOrganizationPermission: vi.fn(() => 'Mocked Response')
  }
})

describe("POST /api/projects", ()=> {
    
    beforeEach(()=> {
        vi.clearAllMocks();
    })

    test("Should fail if user does not have permission", async ()=> {
        
        await expect();

    })
})