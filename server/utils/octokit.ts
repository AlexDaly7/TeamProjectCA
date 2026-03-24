import { App } from "octokit";
import env from "~~/lib/env";

const privateKey = env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n");

export const ghApp = new App({
    appId: env.GITHUB_APP_ID,
    privateKey,
});