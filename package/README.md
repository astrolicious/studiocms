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
CMS_GITHUB_CLIENT_ID=
CMS_GITHUB_CLIENT_SECRET=
```

When you setup the Github Oauth App for these keys use the following for the setup:

For Local dev to work:

Homepage URL: http://localhost:4321
Authorization callback URL: http://localhost:4321/dashboard/login/github/callback

For going to Production:

Homepage URL: https://example.com
Authorization callback URL: https://example.com/dashboard/login/github/callback

### Configuration

Your `astro.config.mjs` should look like the following

> Note: Admins are currently defined by their Github Usernames!

```mjs
import { defineConfig } from "astro/config";
import studioCMS from "@nametbd/astro-studio-cms";
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
            dbStartPage: true // DEFAULT - This creates a file in your /src/pages folder to allow first initialization and config of the installation
        })],
});
```

### First Start and setup

This project is designed to be setup to a new Studio DB, to get started follow the [Link to Astro Studio](https://docs.astro.build/en/recipes/studio/#create-a-new-studio-project)

Then start the dev server using `astro dev` once it completes, stop the dev server and run `astro db push`

Once that process completes successfuly you are ready to launch the integration for the first time.  Start the dev server linked to your remote DB by running `astro dev --remote` and then navigate to http://localhost:4321/start and follow the instructions.

It will redirect and ask you to shutdown and change the above mentioned config option `dbStartPage` to `false` at which point that will enable full functionality of the CMS. you can now restart the dev server with `astro dev --remote` to continue viewing your new site!