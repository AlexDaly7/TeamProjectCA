import { and, eq } from "drizzle-orm";
import { Octokit } from "octokit";
import db from "~~/lib/db";
import { account, user } from "~~/lib/db/schema";
import { ghApp } from "../utils/octokit";

export default defineAuthenticatedEventHandler(async (event) => {


    return { ok: true }
});