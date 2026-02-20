import db from "~~/lib/db";
import project from '~~/lib/db/schema/project';
type projectType = typeof project.$inferInsert;

export async function addProject(titleIn: String) {
    const newProject: projectType = {
        title: titleIn;
    }
    await db.insert(project).values(newProject);
};