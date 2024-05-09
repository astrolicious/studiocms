import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.astro-studiocms.xyz/",
  integrations: [
    starlight({
      title: "Astro StudioCMS",
      description:
        "A dedicated CMS for Astro Studio. Built from the ground up by the Astro community.",
      favicon: "/logo-dark.svg",
      logo: {
        dark: "../assets/logo-light.svg",
        light: "../assets/logo-dark.svg",
      },
      social: {
        github: "https://github.com/astrolicious/studiocms",
      },
      customCss: [
        // Relative path to your custom CSS file
        "./src/styles/custom.css",
      ],
      editLink: {
        baseUrl: "https://github.com/astrolicious/studiocms/tree/main/www/docs",
      },
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
            content: site + "og.png?v=1",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "twitter:image",
            content: site + "og.png?v=1",
          },
        },
      ],
      sidebar: [
        {
          label: "Start Here",
          autogenerate: { directory: "start-here" },
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
