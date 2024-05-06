export const DbErrors = {
    AstroConfigOutput: "Astro Studio CMS is only supported in 'Output: server' SSR mode.",
    AstroConfigSiteURL: "Astro Studio CMS requires a 'site' configuration in your Astro Config. This can be your domain ( 'https://example.com' ) or localhost ( 'http://localhost:4321' - localhost should only be used during development and should not be used in production).",
    DbStartPage: "Start Page is Enabled.  This will be the only page available until you initialize your database and disable the config option forcing this page to be displayed. To get started, visit http://localhost:4321/start/ in your browser to initialize your database. And Setup your installation.",
}

export const DashboardStrings = {
    TestAndDemo: 'Testing and Demo Mode is Enabled, Authentication will not be required to access dashboard pages.  But you will only be able to edit the database from the Astro Studio Dashboard, https://studio.astro.build/',
    AuthDisabled: 'Auth is Disabled by the User Configuration.  You will only be able to edit the database from the Astro Studio Dashboard, https://studio.astro.build/',
    DashboardDisabled: 'Dashboard is Disabled, Some tools and Utilities are still available for developers who are customizing their setup!',
}