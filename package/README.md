# Astro Studio CMS

This is a SSR Blog CMS built with AstroDB / Lucia Auth / Unpic Image handler / Astro

### Installation

Start from a clean Astro installation with AstroDB

Example with pnpm

```sh
# create a new project with pnpm
pnpm create astro@latest
```

```sh
# add astrodb
pnpm astro add db
```

```sh
# Add Astro-Studio-CMS
pnpm astro add @nametbd/astro-studio-cms
```

### Authentication

Lucia Auth - requires two .env tokens to create the connection between Github and your Auth

```
# credentials for GitHub OAuth App
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Configuration

Your `astro.config.mjs` should look like the following

> Note: Admins are currently defined by their Github Usernames!

```mjs
import { defineConfig } from "astro/config";
import studioCMS from "@matthiesenxyz/astro-studio-cms";
import db from '@astrojs/db';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	output: "server",
	adapter: vercel(),
	integrations: [
        db(),
        studioCMS({ 
            siteTitle: "Astro Studio Blog",
            siteDescription: "My awesome website!",
            siteAdmins: ['firstGithubUsername','secondGithubUsername'],
        })],
});
```