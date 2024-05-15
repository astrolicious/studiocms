import { defineStudioCMSConfig } from "@astrolicious/studiocms";

export default defineStudioCMSConfig({
    dbStartPage: false,
    contentRenderer: 'marked',
    verbose: true,
    dateLocale: 'en-us',
    includedIntegrations: {
        useAstroRobots: true,
        useInoxSitemap: true,
    },
    imageService: {
        useUnpic: true,
    },
    markedConfig: {
        highlighterConfig: {
            highlighter: 'disabled',
        },
    },
    dashboardConfig: {
        AuthConfig: {
            enabled: true,
            providers: {
                auth0: false,
                discord: true,
                github: true,
                google: false,
                usernameAndPassword: true,
                usernameAndPasswordConfig: {
                    allowUserRegistration: true,
                },
            },
        },
        dashboardEnabled: true,
        developerConfig: {
            testingAndDemoMode: false,
        },
    },
})