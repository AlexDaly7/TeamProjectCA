# Mórchlár

<img width="50%" alt="Mórchlár" src="https://github.com/user-attachments/assets/8f382e8d-e2bc-46c4-a9ae-e4c8a78b34e1" />

**Collaborative team project tracking with GitHub integration.**

## Technologies

### Frontend

- **Nuxt 4 + Vue 3** for app UI and routing.
- **Typescript** for type safety.
- **Tailwind CSS** for utility-based styling.
- [**Reka UI**](https://reka-ui.com/) for headless UI components.
- [**vue-timeline-chart**](https://laurens94.github.io/vue-timeline-chart/) for chart rendering.

### Backend

- **Nuxt** for serverless backend.
- **Better Auth** for auth and organizations.
- **Drizzle ORM** for database access and schema definitions.
- **Zod** for validation.

### Infra

- [**Bun**](https://bun.com/) for dependency management and running.
- **PostgreSQL** for database.
- [**Neon**](https://neon.com/) as a cloud Postgres provider.
- [**Pusher**](https://pusher.com/) for realtime updates.
- [**Resend**](https://resend.com/) for emails/email invites.
- [**Octokit**](https://github.com/octokit) for GitHub API integration

### Testing

- [**Vitest**](https://vitest.dev/) for test running.
- [**@nuxt/test-utils**](https://nuxt.com/modules/test-utils) for Nuxt-specific testing.
- [**Playwright**](https://playwright.dev/) for browser testing.

## Setup

For both dev and production environments, follow the [setup guide](docs/setup.md).

### Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

### Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

## Testing

Each team members' tests are located in a separate directory in the `test/` folder. To run each test there is an appropriate `package.json` script to do so.

- Thomas: `bun run test:tom`
- Alex: `bun run test:alex`
- Antonio: `bun run test:antonio`
- Joseph: `bun run test:joseph`
