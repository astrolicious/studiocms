import { defineStudioCMSConfig } from 'studiocms';

export default defineStudioCMSConfig({
	dbStartPage: false,
	verbose: true,
	dateLocale: 'en-us',
	rendererConfig: {
		renderer: 'marked',
		markedConfig: {
			highlighterConfig: {
				highlighter: 'disabled',
			},
		},
		markdocConfig: {
			reactComponents: {
				components,
			},
		},
	},
	defaultFrontEndConfig: {
		favicon: '/favicon.svg',
		htmlDefaultHead: [
			{
				tag: 'script',
				attrs: {
					src: 'https://analytics.astro-studiocms.xyz/script.js',
					'data-website-id': '23a84c25-40fd-4303-a191-aba4bfaf3ff1',
					defer: true,
				},
			},
		],
	},
	includedIntegrations: {
		useAstroRobots: true,
		useInoxSitemap: true,
	},
	imageService: {
		useUnpic: true,
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
});
