# Introducing AstroStudio CMS: A Community-Driven CMS for Astro Studio

As part of our efforts, we're excited to introduce AstroStudio CMS - a dedicated content management system (CMS) built on top of Astro's latest product, [Astro Studio](https://studio.astro.build). This project was developed by [Adam](https://github.com/Adammatthiesen), [Dreyfus](https://github.com/dreyfus92), and [Jumper](https://github.com/jdtjenkins), three passionate members of the Astro community.

## Why another CMS?

While Astro's content capabilities are powerful, we recognized a need for a more streamlined and user-friendly CMS solution within the Astro ecosystem. Many Astro users, especially those coming from more traditional CMS backgrounds, have expressed a desire for a dedicated CMS that can seamlessly integrate with Astro projects.

AstroStudio CMS was born out of this need, providing a content management platform that is tailor-made for Astro. By building on top of Astro Studio, we're able to offer a CMS experience that feels native to the Astro workflow, making it easier for both developers and content creators to collaborate on Astro-powered projects.

## An Experimental Endeavor

It's important to note that AstroStudio CMS is an experimental project that heavily relies on the @astrojs/db package, which is currently in active development and not yet considered stable. As a result, you should expect a significant number of breaking changes as the project continues to evolve.

We believe that by building on the cutting-edge features of Astro Studio, we can create a powerful and innovative CMS solution. However, this also means that AstroStudio CMS may not be suitable for mission-critical or production-ready projects at this stage. We encourage you to use caution and thoroughly test the CMS in your own projects before deploying it to a live environment.


## Leveraging the Power of Astro

AstroStudio CMS is built from the ground up to seamlessly integrate with Astro's robust and efficient framework. By harnessing the power of Astro, we've created a CMS solution that aligns perfectly with the Astro ecosystem, providing a solid foundation for building and scaling Astro-powered applications.

## Key Features

**Astro Foundation:** Astrolicious leverages Astro's robust and efficient framework, providing a solid base for building and scaling applications.

**Enhanced Markdown:** We've incorporated 'Marked' with support for extensions, enriching the markdown experience with greater flexibility and functionality.

**Shiki Syntax Highlighting:** Astrolicious offers Shiki-powered syntax highlighting, ensuring your code is both visually appealing and easy to read. This is especially useful in non-Cloudflare environments due to bundle size considerations.

**Markdoc Integration:** In addition to 'Marked', Astrolicious provides an alternative with Markdoc, offering users a choice for their markdown processing needs.

**Secure Studio Database:** All data is securely housed within the Astro Studio database, ensuring accessibility only to authorized users with studio.astro.build login credentials.

**Built-in Authentication:** Astrolicious features built-in authentication with support for multiple platforms, including Local and Github, enhancing security and user management (currently in development).

**Unpic Image Service:** Astrolicious includes a free and efficient image service, Unpic, which makes managing external URLs straightforward, with support for major CDNs.

## A Community-Driven Effort

At the heart of Astrolicious is a deep commitment to community involvement and collaboration. We believe that the development of AstroStudio CMS should be a collective effort, drawing on the diverse talents and perspectives of the Astro community.

To that end, we've handed the repository Astrolicious as an open organization, welcoming contributors of all skill levels to get involved and help shape the future of this CMS. Whether you're a seasoned Astro developer or new to the ecosystem, we encourage you to join our [Discord server](https://chat.astrolicious.dev/) and explore ways to contribute.

By fostering a sense of shared ownership and investment, we aim to create a CMS that truly reflects the needs and desires of the Astro community. Your feedback, ideas, and code contributions will be invaluable as we work to build a feature-rich and user-friendly content management solution for Astro.

So don't be a stranger - come join us on this journey and help us realize the full potential of AstroStudio CMS!

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
pnpm astro add @astrolicious/studiocms
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
import astroStudioCMS from "@astrolicious/studiocms";
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

*Note: `astrojs/db` does not currently maintain all database data without a [seed file](https://docs.astro.build/en/guides/astro-db/#seed-your-database) which would not work with the CMS. Until a local database is persistant between sessions we highly recommend connecting to a remote DB to allow for data to persist*

Commands to run:
- `astro db link` - Link to Astro Studio and Create a new DB for your CMS Installation
- `astro db push` - Creates the base tables on the remote database.
- `astro dev --remote` - Starts the Dev server connected to the linked database

Once that process completes successfuly you are ready to navigate to http://localhost:4321/start and follow the instructions to get started.

It will redirect and ask you to shutdown and change the above mentioned config option `dbStartPage` to `false` at which point that will enable full functionality of the CMS. you can now restart the dev server with `astro dev --remote` to continue viewing your new site!

## Get Involved

As members of [Astrolicious](https://github.com/astrolicious) we are a free and open-source project, and we welcome contributions from the Astro community. If you're interested in getting involved, please visit our [GitHub repository](https://github.com/astrolicious/studiocms) and join our [Discord server](https://chat.astrolicious.dev/). Together, let's build an even stronger and more vibrant Astro ecosystem.