import { defineStudioCMSConfig } from '@astrolicious/studiocms';

export default defineStudioCMSConfig({
	dbStartPage: false,
	contentRenderer: 'marked',
	verbose: true,
	dateLocale: 'en-us',
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
});
