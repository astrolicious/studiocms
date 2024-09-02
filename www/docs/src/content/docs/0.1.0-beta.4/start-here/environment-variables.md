---
title: Environment Variables
description: A brief overview of the environment variables used in Astro StudioCMS.
slug: 0.1.0-beta.4/start-here/environment-variables
---

For Astro StudioCMS to work correctly, you must set up the correct environment variables. These variables are essential for establishing a secure connection to Astro DB and authenticating with the Astro StudioCMS API. Without correctly configuring these environment variables, the application will not function as intended.

You can create a `.env` file in the root directory of your project and add the required environment variables. The `.env` file is a text file that contains key-value pairs of environment variables. The environment variables are read by the application at runtime.

For future reference on how to work with environment variables within Astro you can checkout [Environment Variables](https://docs.astro.build/guides/environment-variables) from the Astro documentation.

:::note
StudioCMS makes use of Astro's new Experimental [`astro:env`](https://docs.astro.build/en/reference/configuration-reference/#experimentalenv) for handling all of its Environment Variables. If you face any issues with environment variables please submit an [issue on Github](https://github.com/astrolicious/studiocms/issues/new/choose)
:::

## Required Environment Variables

`ASTRO_STUDIO_APP_TOKEN` is required to connect to the database.

```bash title=".env"
ASTRO_STUDIO_APP_TOKEN=your_app_token
```

## Authentication Environment Variables

Currently there are 5 ways to authenticate with Astro StudioCMS:

:::tip
Use `http://localhost:4321` for local development and testing callback urls, and `https://your-domain.tld` for your callback urls in production!
:::

### GitHub

To authenticate with GitHub, you need to add the following environment variables to your `.env` file:

```bash title=".env"
# credentials for GitHub OAuth
# Callback URL for github (NOT AN ENV VARIABLE): 'http://localhost:4321/dashboard/login/github/callback'
CMS_GITHUB_CLIENT_ID=your_client_id
CMS_GITHUB_CLIENT_SECRET=your_client_secret
```

### Discord

```bash title=".env"
# credentials for Discord OAuth
CMS_DISCORD_CLIENT_ID=
CMS_DISCORD_CLIENT_SECRET=
CMS_DISCORD_REDIRECT_URI=http://localhost:4321/dashboard/login/discord/callback
```

### Google

```bash title=".env"
# credentials for Google OAuth
CMS_GOOGLE_CLIENT_ID=
CMS_GOOGLE_CLIENT_SECRET=
CMS_GOOGLE_REDIRECT_URI=http://localhost:4321/dashboard/login/google/callback
```

### Auth0

```bash title=".env"
# credentials for auth0 OAuth
CMS_AUTH0_CLIENT_ID=
CMS_AUTH0_CLIENT_SECRET=
CMS_AUTH0_DOMAIN=
CMS_AUTH0_REDIRECT_URI=http://localhost:4321/dashboard/login/auth0/callback
```

### Username and Password

Alternatively, you can authenticate with Astro StudioCMS using your username and password which doesn't require any additional environment variables.

:::note
When Username and Password authentication is enabled you can modify its configuration and level of security using the generated `studiocms-auth.config.json` file.
:::

## Image Handler Environment Variables

### Cloudinary (Optional)

If you choose to use the built-in Cloudinary plugin, you will need to define the following:

```bash title=".env"
## Cloudinary Javascript SDK
CMS_CLOUDINARY_CLOUDNAME="demo"
```
