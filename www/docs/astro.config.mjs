import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
// import starlightLinksValidator from 'starlight-links-validator'; // Disabled for now
import { createStarlightTypeDocPlugin } from 'starlight-typedoc';

const [studioCMSTypeDoc, studioCMSTypeDocSidebarGroup] = createStarlightTypeDocPlugin();
const [studioCMSBlogTypeDoc, studioCMSBlogTypeDocSidebarGroup] = createStarlightTypeDocPlugin();
const [studioCMSAdminTypeDoc, studioCMSAdminTypeDocSidebarGroup] = createStarlightTypeDocPlugin();

const TypeDocSidebarGroup = [studioCMSTypeDocSidebarGroup, studioCMSBlogTypeDocSidebarGroup, studioCMSAdminTypeDocSidebarGroup];

const site = "https://docs.astro-studiocms.xyz/";

const TypeDocOpts = (label, readme) => {
  return {
    sidebar: {
      label: label,
      collapsed: true,
    },
    pagination: true,
    typeDoc: {
      readme: readme,
      jsDocCompatibility: true,
      skipErrorChecking: true,
    }
  }
}

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
      plugins: [
        studioCMSTypeDoc({
          tsconfig: '../../packages/studioCMS/tsconfig.json',
          entryPoints: [ 
            '../../packages/studioCMS/src/index.ts',
            '../../packages/studioCMS/src/coreIntegration.ts',
            '../../packages/studioCMS/src/studiocms-config.ts',
            '../../packages/studioCMS/src/db/config.ts',
            '../../packages/studioCMS/src/db/tables.ts',
            '../../packages/studioCMS/src/components/headDefaults.ts',
            '../../packages/studioCMS/src/utils/renderers/contentRenderer.ts',
            '../../packages/studioCMS/src/utils/renderers/marked.ts',
            '../../packages/studioCMS/src/utils/renderers/markdoc.ts',
            '../../packages/studioCMS/src/utils/renderers/astromd.ts',
            '../../packages/studioCMS/src/utils/authhelper.ts',
            '../../packages/studioCMS/src/utils/contentHelper.ts',
          ],
          output: 'typedoc/studiocms-core',
          ...TypeDocOpts("StudioCMS-Core", "../../packages/studioCMS/README.md")
        }),
        studioCMSAdminTypeDoc({
          tsconfig: '../../packages/studioCMS/tsconfig.json',
          entryPoints: [ 
            '../../packages/studioCMS/src/integrations/studioCMSDashboard/index.ts',
            '../../packages/studioCMS/src/integrations/studioCMSDashboard/schemas.ts',
            '../../packages/studioCMS/src/integrations/studioCMSDashboard/env.ts',
            '../../packages/studioCMS/src/integrations/studioCMSDashboard/lib/auth.ts',
            '../../packages/studioCMS/src/integrations/studioCMSDashboard/middleware/index.ts',
          ],
          output: 'typedoc/studiocms-dashboard',
          ...TypeDocOpts("StudioCMS-Dashboard")
        }),
        studioCMSBlogTypeDoc({
          tsconfig: '../../packages/studioCMSBlog/tsconfig.json',
          entryPoints: [ 
            '../../packages/studioCMSBlog/index.ts',
            '../../packages/studioCMSBlog/schema.ts',
            '../../packages/studioCMSBlog/src/pages/rss.xml.ts', 
          ],
          output: 'typedoc/studiocms-blog',
          ...TypeDocOpts("StudioCMS-Blog", "../../packages/studioCMSBlog/README.md")
        }),
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
          collapsed: true,
        },
        {
          label: "TypeDoc",
          badge: {
            text: "Auto-Generated",
            variant: "success",
          },
          items: TypeDocSidebarGroup,
        }
      ],
      lastUpdated: true,
    }),
  ],
});
