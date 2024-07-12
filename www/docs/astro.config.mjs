import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from 'starlight-links-validator'

const site = "https://docs.astro-studiocms.xyz/";

export default defineConfig({
  site,
  integrations: [
    starlight({
      title: "Astro StudioCMS",
      description:
        "A dedicated CMS for Astro Studio. Built from the ground up by the Astro community.",
      favicon: "/logo-dark.svg",
      tagline: "A dedicated CMS for Astro Studio. Built from the ground up by the Astro community.",
      expressiveCode: {
        themes: ["houston", "starlight-light"]
      },
      logo: {
        dark: "../assets/logo-light.svg",
        light: "../assets/logo-dark.svg",
      },
      social: {
        github: "https://github.com/astrolicious/studiocms",
        discord: "https://chat.astrolicious.dev",
      },
      customCss: [
        // Relative path to your custom CSS file
        "./src/styles/custom.css",
      ],
      credits: true,
      editLink: {
        baseUrl: "https://github.com/astrolicious/studiocms/tree/main/www/docs",
      },
      plugins: [
        starlightLinksValidator(),
      ],
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://analytics.astro-studiocms.xyz/script.js",
            "data-website-id": "d9823e76-3219-4f86-9a09-0cb763ebfd19",
            defer: true,
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: `${site}og.png?v=1`,
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "twitter:image",
            content: `${site}og.png?v=1`,
          },
        },
      ],
      sidebar: [
        {
          label: "Start Here",
          items: [
            {
              label: "Getting Started with Astro StudioCMS",
              link: "/start-here/getting-started",
            },
            {
              label: "Environment Variables",
              link: "/start-here/environment-variables",
            },
            {
              label: "Configuration",
              link: "/start-here/configuration",
            },
            {
              label: "Why Astro StudioCMS?",
              link: "/start-here/why-studiocms",
            },
            { label: "Gallery", link: "/start-here/gallery" },
          ],
        },
        {
          label: "Plugins",
          items: [
            { 
              label: "Web Vitals", 
              link: "/plugins/web-vitals",
              badge: {
                text: "AstroJS",
                variant: "success",
              } 
            },
            {
              label: "Blog Integration",
              link: "/plugins/studiocms-blog",
              badge: {
                text: "StudioCMS",
                variant: "tip",
              }
            }
          ],
        },
        {
          label: "Understanding StudioCMS",
          items: [
            { label: "How does it work!?", link: "/how-it-works/" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      lastUpdated: true,
    }),
  ],
});
