import type { RobotsConfig } from "./integrations/robotstxt"

export const DbErrors = {
    AstroConfigOutput: "Astro Studio CMS is only supported in 'Output: server' SSR mode.",
    AstroConfigSiteURL: "Astro Studio CMS requires a 'site' configuration in your Astro Config. This can be your domain ( 'https://example.com' ) or localhost ( 'http://localhost:4321' - localhost should only be used during development and should not be used in production).",
    DbStartPage: "Start Page is Enabled.  This will be the only page available until you initialize your database and disable the config option forcing this page to be displayed. To get started, visit http://localhost:4321/start/ in your browser to initialize your database. And Setup your installation.",
}

export const studioErrors = {
    failedToParseConfig: "The StudioCMS config file ('studiocms.config.mjs') was found but the following errors where encountered while parsing it:",
    invalidConfigFile: "Invalid StudioCMS Config File",
    invalidOrMissingExport: 'Missing or invalid default export. Please export your StudioCMS config object as the default export.',
    loadingError: `Your project includes an StudioCMS config file ("studiocms.config.mjs") that could not be loaded due to`,
}

export const warnings = {
    StudioCMSConfigPresent: 'Your project includes a StudioCMS config file ("studiocms.config.mjs"). To avoid unexpected results from merging multiple config sources, move all StudioCMS options to the StudioCMS config file. Or remove the file to use only the options provided in the Astro config.',
    MultipleRendererPlugins: 'Multiple Renderer Plugins are Enabled.  Only one Renderer Plugin can be enabled at a time.  The first Renderer Plugin in the list will be used.',
}

export const DashboardStrings = {
    TestAndDemo: 'Testing and Demo Mode is Enabled, Authentication will not be required to access dashboard pages.  But you will only be able to edit the database from the Astro Studio Dashboard, https://studio.astro.build/',
    AuthDisabled: 'Auth is Disabled by the User Configuration.  You will only be able to edit the database from the Astro Studio Dashboard, https://studio.astro.build/',
    DashboardDisabled: 'Dashboard is Disabled, Some tools and Utilities are still available for developers who are customizing their setup!',
}

export const MakeFrontendStrings = {
    NoDBStartPage: "Database Start Page disabled, skipping Database Setup and injecting Default Frontend Routes...",
    InjectDefaultFrontendRoutes: "Injecting Default Frontend Routes...",
    Inject404Route: "Injecting 404 Route...",
    DefaultRoutesInjected: "StudioCMS Default Routes Injected!",
    DBStartPageEnabled: "Database Start Page enabled, skipping Default Frontend Routes Injection... Please follow the Database Setup Guide to create your Frontend."
}

export const robotsTXTPreset: Partial<RobotsConfig> = { 
    policy: [
        {
            userAgent: ['*'],
            allow: ['/'],
            disallow: ['/dashboard/'],
        },
    ]
}

export const imageHandlerStrings = {
    CloudinaryCDNWarning: "Using the Cloudinary CDN JS SDK Plugin requires the CMS_CLOUDINARY_CLOUDNAME environment variable to be set. Please add this to your .env file.",
    NodeAdapter: "Node Adapter Detected. Using Node Adapter.",
    CloudflareAdapter: "Cloudflare Adapter Detected. Using Cloudflare Adapter.",
    VercelAdapter: "Vercel Adapter Detected. Using Vercel Adapter.",
    NetlifyAdapter: "Netlify Adapter Detected. Using Netlify Adapter.",
    UnknownAdapter: {
        part1: "Unknown Adapter Detected: ",
        part2: ". studioCMS Image Handler has not been configured for this adapter. Please open an issue on the studioCMS GitHub Repository. https://github.com/astrolicious/studioCMS/issues"
    },
    NoAdapter: "No Adapter Detected. studioCMS Image Handler will only be configured with Known SSR Adapters!",
}

export const genericAdapterStrings = {
    Squoosh: "Using Squoosh Image Service...",
    Sharp: "Using Sharp Image Service...",
    NoOp: "Using No-Op(Passthrough) Image Service...",
    cdnPluginStrings: {
        Squoosh: "Using Squoosh Image Service as Fallback for Cloudinary CDN Plugin",
        Sharp: "Using Sharp Image Service as Fallback for Cloudinary CDN Plugin",
        NoOp: "Using No-Op Image Service as Fallback for Cloudinary CDN Plugin",
    },
    unpicStrings: {
        default: "Loading @unpic/astro Image Service for External Images",
        NoOp: "Loading @unpic/astro Image Service for External Images with No-Op Fallback",
        disabled: "@unpic/astro Image Service Disabled, using Astro Built-in Image Service."
    }
}

export const vercelImageHandlerStrings = {
    VercelBuildImageServerEnabled: "Vercel Image Service Enabled. Using Vercel Image Service.",
    VercelBuildImageServerDisabled: "Vercel Image Service Disabled. Using Astro Built-in Image Service.",
    ...genericAdapterStrings
}

export const nodeImageHandlerStrings = {
    ...genericAdapterStrings
}

export const netlifyImageHandlerStrings = {
    NetlifyImageServiceEnabled: "Netlify Image Service Enabled. Using Netlify Image Service.",
    NetlifyImageServiceDisabled: "Netlify Image Service Disabled. Using Astro Built-in Image Service.",
    ...genericAdapterStrings
}

export const cloudflareImageHandlerStrings = {
    CloudflareImageServiceEnabled: "Cloudflare Image Service Enabled. Using Cloudflare Image Service.",
    CloudflareImageServiceDisabled: "Cloudflare Image Service Disabled. Using Astro Built-in Image Service.",
    unsupported: {
        Squoosh: "Cloudflare SSR does not support Squoosh Image Service. Using no-op Service as astroImageServiceConfig is set to 'squoosh'",
        Sharp: "Cloudflare SSR does not support Sharp Image Service. Using no-op Service as astroImageServiceConfig is set to 'sharp'",
    },
    ...genericAdapterStrings
}