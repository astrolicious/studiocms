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

# OPTIONALS
## Cloudinary Javascript SDK
CMS_CLOUDINARY_CLOUDNAME="demo"
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
import astroStudioCMS from "@astrolicious/astro-studiocms";
import db from '@astrojs/db';
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	output: "server",
	adapter: node({ mode: 'standalone' }),
	integrations: [
        db(),
        astroStudioCMS({
            dbStartPage: true // DEFAULT - This injects a start page to setup your DB data.
        })],
});
```

### First Start and setup

This project is designed to be setup to a new Studio DB, to get started follow the [Link to Astro Studio](https://docs.astro.build/en/recipes/studio/#create-a-new-studio-project)

*Note: Due to a limitation in `astrojs/db` currently it is impossible for a integrations injected pages to populate the local database.*

*Note: `astrojs/db` does not currently maintain all database data without a [seed file](https://docs.astro.build/en/guides/astro-db/#seed-your-database) which would not work with the CMS. Until a local database is persistant between sessions we highly recommend connecting to a remote DB to allow for data to persist*

Commands to run:
- `astro db link` - Link to Astro Studio and Create a new DB for your CMS Installation
- `astro db push` - Creates the base tables on the remote database.
- `astro dev --remote` - Starts the Dev server connected to the linked database

Once that process completes successfuly you are ready to navigate to http://localhost:4321/start and follow the instructions to get started.

It will redirect and ask you to shutdown and change the above mentioned config option `dbStartPage` to `false` at which point that will enable full functionality of the CMS. you can now restart the dev server with `astro dev --remote` to continue viewing your new site!