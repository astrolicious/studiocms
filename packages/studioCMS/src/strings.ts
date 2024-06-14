export const DbErrors = {
    AstroConfigOutput: "Astro Studio CMS is only supported in 'Output: server' SSR mode.",
    AstroConfigSiteURL: "Astro Studio CMS requires a 'site' configuration in your Astro Config. This can be your domain ( 'https://example.com' ) or localhost ( 'http://localhost:4321' - localhost should only be used during development and should not be used in production).",
    DbStartPage: "Start Page is Enabled.  This will be the only page available until you initialize your database and disable the config option forcing this page to be displayed. To get started, visit http://localhost:4321/start/ in your browser to initialize your database. And Setup your installation.",
}

export const studioErrors = {
    failedToParseConfig: "The StudioCMS config file ('studiocms.config.mjs') was found but the following errors where encountered while parsing it:",
    invalidConfigFile: "Invalid StudioCMS Config File"
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