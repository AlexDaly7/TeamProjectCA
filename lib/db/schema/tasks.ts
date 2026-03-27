import { relations } from "drizzle-orm";
import {
    pgTable,
    serial,
    text,
    integer,
    timestamp,
    type AnyPgColumn,
    real,
} from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { taskAssignees } from "./taskAssignees";

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),

    projectId: integer("project_id")
        .references(() => projects.id, { onDelete: "cascade" })
        .notNull(),
    parentId: integer("parent_id")
        .references((): AnyPgColumn => tasks.id, {
        onDelete: "cascade",
    }),

    ghIssueNodeId: text('gh_issue_node_id').notNull(),
    ghIssueNumber: integer('gh_issue_number').notNull(),

    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    progress: real("progress").default(0), // 0.00 to 1.00 as %

    order: integer("order").default(0), // Order as sibling

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
});

export const taskRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    parent: one(tasks, {
        fields: [tasks.parentId],
        references: [tasks.id],
        relationName: "subtasks",
    }),
    subtasks: many(tasks, {
        relationName: "subtasks",
    }),
    assignees: many(taskAssignees),
}));

const preprocessDate = z.preprocess((value) => {
    // Since we submit the values as a date string, but we need
    // to format them into a Date instance back on the server, just
    // throw it into a new Date
    if (typeof value === "string" && value.trim() !== "") return new Date(value);

    return value;
}, z.date());


// Create
export const InsertTask = createInsertSchema(tasks, {
    title: z.string().min(3, 'Too short!').max(100, 'Too long!').optional(),
    description: z.string().max(2000, 'Too long!').optional(),
    startTime: () => preprocessDate,
    endTime: () => preprocessDate,
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertTaskSchema = z.infer<typeof InsertTask>;


export const ClientInsertTask = InsertTask.omit({
    ghIssueNodeId: true,
    ghIssueNumber: true,
    projectId: true,
});

export type ClientInsertTaskSchema = z.infer<typeof ClientInsertTask>;


// READ
export type TasksSchema = typeof tasks.$inferSelect;

// UPDATE
export const ModifyTask = createUpdateSchema(tasks, {
    title: z.string().min(3, 'Too short!').max(100, 'Too long!').optional(),
    description: z.string().max(2000, 'Too long!').optional(),
    startTime: () => preprocessDate,
    endTime: () => preprocessDate,
    id: () => z.number(),
})
    .omit({
        createdAt: true,
        updatedAt: true,
        ghIssueNodeId: true,
        ghIssueNumber: true,
        projectId: true,
        id: true,
    });

export type ModifyTaskSchema = z.infer<typeof ModifyTask>;

export const ClientModifyTask = ModifyTask;

export type ClientModifyTaskSchema = z.infer<typeof ClientModifyTask>;

// DELETE doesn't need body