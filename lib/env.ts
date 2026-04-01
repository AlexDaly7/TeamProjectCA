import z, { ZodError, ZodObject, type ZodRawShape } from "zod";

function tryParseEnv<T extends ZodRawShape>(
    EnvSchema: ZodObject<T>,
    buildEnv: Record<string, string | undefined> = process.env,
) {
    try {
        EnvSchema.parse(buildEnv);
    } catch (error) {
        if (error instanceof ZodError) {
            let message = "Missing required values in .env:\n";
            error.issues.forEach(issue => {
                message += `${String(issue.path[0])}\n`;
            });

            const e = new Error(message);
            e.stack = "";
            throw e;
        } else {
            throw error;
        }
    }
}

const EnvSchema = z.object({
    DATABASE_URL: z.string(),

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    NUXT_PUBLIC_BETTER_AUTH_BASE_URL: z.string(),

    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_APP_ID: z.string(),
    GITHUB_APP_PRIVATE_KEY: z.string(),

    PUSHER_APP_ID: z.string(),
    PUSHER_KEY: z.string(),
    PUSHER_SECRET: z.string(),
    PUSHER_CLUSTER: z.string(),

    RESEND_API_KEY: z.string(),
});


export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

export default EnvSchema.parse(process.env);