import { App } from "octokit";
import env from "~~/lib/env";

const privateKey = env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n");

const githubApp = new App({
    appId: env.GITHUB_APP_ID,
    privateKey,
});

export default githubApp;