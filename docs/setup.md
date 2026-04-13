# Setting up a local Mórchlár development instance

This is a guide for setting up a local instance of Mórchlár for development. Note that even though this is local, you will need to own a domain in order to setup Resend to send organization invites via email.

## 1. Downloading

Clone from GitHub:

```bash
git clone git@github.com:Morchlar/Morchlar.git # or https://github.com/Morchlar/Morchlar.git
```

then

```bash
cd Morchlar/
```

## 2. Setting up the env file

Create a `.env` file in the root directory of the project. This will need to contain configs several from 3rd-party services.

### 2.1. Postgres DB

This project uses **Neon** severless Postgres as a database. You can set up a cloud database to connect to [on their website](https://neon.com/), or create a [local proxy](https://neon.com/docs/local/neon-local) if you want local-only development.

One you have a connection URL, set this as the value for `DATABASE_URL` in the env file. Then, run the migrations to setup the database with `bun run db:migrate`.

### 2.2. Better Auth

The `BETTER_AUTH_URL` is the URL of your app. By default for local development this should be `http://localhost:3000`, but will need to be changed to your production URL once in production.

`BETTER_AUTH_SECRET` should be a cryptographically secure pseudorandom number (CSPRN). One way to generate this via the commandline is:

```bash
openssl rand -hex 32
```

### 2.3. GitHub

This will be the most involved part of the setup process, as you need to make sure all configuration is correct for a working setup.

**Step 1**

- Go to [https://github.com/settings/apps](https://github.com/settings/apps) and create a new GitHub App (not OAuth App).
    > If you are creating an app for an organization, go to `https://github.com/organizations/<your-org>/settings/apps`
- Set the name and description to whatever you wish.
- For homepage url, set this to the URL of your app / the `BETTER_AUTH_URL`.
- Set the callback URL to the same url plus `/api/auth/callback/github`. E.g. `http://localhost:3000/api/auth/callback/github`.
- Make sure 'Request user authorization (OAuth) during installation' is **disabled**, otherwise you will get a Better Auth error when logging in.
- Set webhook to active. For URL, either use \<production-url\>/api/gh-webhook, or if testing locally, go to [smee](https://smee.io/) and get a URL from there. Follow the instructions to set up local testing as shown on the smee website.
- Generate a secure secret to use as the webhook secret. Then write this into .env as `GITHUB_APP_WEBHOOK_SECRET`.
- For repository permissions, set 'Administration' to Read and write, and set 'Issues' to 'Read and write'. 'Metadata' should have been automatically selected as mandatory read-only.
- No organization permissions required.
- For Account permissions, set 'Email addresses' to Read only.
- Set 'Where can this GitHub App be installed?' to 'Any account'.
- Click create.

**Step 2**

Once your app is registed, copy the App ID and Client ID to `GITHUB_APP_ID` and `GITHUB_CLIENT_ID` respectively.

Then, generate a private key. This should start downloading a `*private-key.pem` file. Once you have downloaded this file, open it in a text editor, then replace every line break with a literal `\n`. E.g.:

```
-----BEGIN RSA PRIVATE KEY-----
ABCDEF....
123456....
...
```

into:

```
-----BEGIN RSA PRIVATE KEY-----\nABCDEF....\n123456...\n...
```

then, paste this inside double quotes into your env file as `GITHUB_APP_PRIVATE_KEY`.

After this, generate a new client secret in the GitHub app page, and copy it's contents to `GITHUB_CLIENT_SECRET`. This should be your GitHub app set-up. You can customise the name, description, and image as you wish.

### 2.4. Pusher

TODO (Alex)

### 2.5. Resend

Create a resend account at [https://resend.com/signup](https://resend.com/signup). Once you have verified your email and logged in, you will be given an API key. Set the API key as the value for `RESEND_API_KEY`.

You will need to setup your domain to work with Resend before any emails can be sent.

### 3. Installing dependencies

Install dependencies with:

```bash
bun install
```

if you are going to test, you will need to setup playwright:

```bash
bunx playwright install
```

### 4. Running

Run the dev server with:

```bash
bun dev
```

> You will need to have the dev server running for some test to run, as they connect directly to the running dev website.

You can run tests with:

```bash
bun run test
```
