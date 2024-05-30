import db from '@astrojs/db';
import node from '@astrojs/node';
import studioCMS from '@astrolicious/studiocms';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://demo.astro-studiocms.xyz/',
	output: 'server',
	adapter: node({ mode: "standalone" }),
	integrations: [
		db(),
		studioCMS({
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
		}),
	],
});
