import db from '../../db';
import { projects } from '../schema';

export async function addProject() {
    await db
        .insert(projects)
        .values({
            title: "Project 1",
        })
}