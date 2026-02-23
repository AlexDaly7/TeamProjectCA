import slugify from "slug";
import { findGroupBySlug } from '~~/lib/db/queries/groups';
import { nanoid } from 'nanoid';

export async function findUniqueSlug(text: string) {
    const slug = slugify(text);

    let existing = !!(await findGroupBySlug(slug));

    while (existing) {
        const id = nanoid();
        const idSlug = `${slug}-${id}`;

        existing = !!(await findGroupBySlug(idSlug));

        if (!existing) {
            return idSlug;
        }
    }

    return slug;
}