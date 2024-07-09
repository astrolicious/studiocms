import { defineStudioCMSConfig } from "@astrolicious/studiocms";

export default defineStudioCMSConfig({
    dbStartPage: false,
    contentRenderer: 'marked',
    verbose: true,
    dateLocale: 'en-us',
    defaultFrontEndConfig: {
        favicon: '/favicon.svg'
    },
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
                auth0: true,
                discord: true,
                github: true,
                google: true,
                usernameAndPassword: true,
                usernameAndPasswordConfig: {
                    allowUserRegistration: true,
                },
            },
        },
        dashboardEnabled: true,
        developerConfig: {
            viewTransitionAPI: false,
            testingAndDemoMode: false,
        },
    },
})