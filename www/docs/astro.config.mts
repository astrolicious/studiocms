import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
// import starlightLinksValidator from 'starlight-links-validator'; // Disabled for now
import { type StarlightTypeDocOptions, createStarlightTypeDocPlugin } from 'starlight-typedoc';

// Create Starlight TypeDoc Plugins for different parts of the Astro StudioCMS Project
//// MAIN PROJECT
// studiocms TypeDoc Plugin
const [tdStudioCMS, tdStudioCMSSideBar] = createStarlightTypeDocPlugin();
// @studiocms/auth
const [tdAuth, tdAuthSideBar] = createStarlightTypeDocPlugin();
// @studiocms/core
const [tdCore, tdCoreSideBar] = createStarlightTypeDocPlugin();
// @studiocms/dashboard
const [tdDashboard, tdDashboardSideBar] = createStarlightTypeDocPlugin();
// @studiocms/frontend
const [tdFrontend, tdFrontendSideBar] = createStarlightTypeDocPlugin();
// @studiocms/imagehandler
const [tdImageHandler, tdImageHandlerSideBar] = createStarlightTypeDocPlugin();
// @studiocms/renderers
const [tdRenderers, tdRenderersSideBar] = createStarlightTypeDocPlugin();
// @studiocms/robotstxt
const [tdRobotsTxt, tdRobotsTxtSideBar] = createStarlightTypeDocPlugin();
// Starlight TypeDoc Sidebar Group for Main Project
const MainProjectTypeDocSidebarGroup = [
	tdAuthSideBar,
	tdCoreSideBar,
	tdDashboardSideBar,
	tdFrontendSideBar,
	tdImageHandlerSideBar,
	tdRenderersSideBar,
	tdRobotsTxtSideBar,
	tdStudioCMSSideBar,
];

//// PLUGINS
// @studiocms/blog
const [tdBlog, tdBlogSideBar] = createStarlightTypeDocPlugin();
// Starlight TypeDoc Sidebar Group for Plugins
const PluginsTypeDocSidebarGroup = [tdBlogSideBar];

// Define the Site URL
const site = process.env.COOLIFY_FQDN || 'https://docs.astro-studiocms.xyz/';

// Utility Function for TypeDoc Options
const makeTypeDocOptions = (
	label: string,
	urlPath: string,
	tsconfig: string,
	entryPoints: string[]
) => {
	return {
		tsconfig,
		entryPoints,
		output: urlPath,
		sidebar: {
			label,
			collapsed: true,
		},
		pagination: true,
		typeDoc: {
			jsDocCompatibility: true,
			skipErrorChecking: true,
			sourceLinkTemplate: 'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
		},
	} as StarlightTypeDocOptions;
};

export default defineConfig({
	site,
	integrations: [
		starlight({
			title: 'Astro StudioCMS',
			description:
				'A dedicated CMS for Astro Studio. Built from the ground up by the Astro community.',
			favicon: '/logo-dark.svg',
			tagline: 'A dedicated CMS for Astro Studio. Built from the ground up by the Astro community.',
			expressiveCode: {
				themes: ['houston', 'starlight-light'],
				defaultProps: {
					wrap: true,
				},
			},
			logo: {
				dark: '../assets/logo-light.svg',
				light: '../assets/logo-dark.svg',
			},
			social: {
				github: 'https://github.com/astrolicious/studiocms',
				discord: 'https://chat.astrolicious.dev',
				youtube: 'https://www.youtube.com/@AstroStudioCMS',
			},
			customCss: [
				// Relative path to your custom CSS file
				'./src/styles/custom.css',
			],
			credits: true,
			editLink: {
				baseUrl: 'https://github.com/astrolicious/studiocms/tree/main/www/docs',
			},
			head: [
				{
					tag: 'script',
					attrs: {
						src: 'https://analytics.astro-studiocms.xyz/script.js',
						'data-website-id': '00717cde-0d92-42be-8f49-8de0b1d810b2',
						defer: true,
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: `${site}og.png?v=1`,
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'twitter:image',
						content: `${site}og.png?v=1`,
					},
				},
			],
			plugins: [
				tdStudioCMS(
					makeTypeDocOptions(
						'studiocms',
						'typedoc/studiocms',
						'../../packages/studiocmd/tsconfig.json',
						[
							'../../packages/studiocms/src/index.ts',
							'../../packages/studiocms/src/integration.ts',
							'../../packages/studiocms/src/updateCheck.ts',
						]
					)
				),
				tdAuth(
					makeTypeDocOptions(
						'@studiocms/auth',
						'typedoc/studiocms-auth',
						'../../packages/studiocms_auth/tsconfig.json',
						[
							'../../packages/studiocms_auth/src/index.ts',
							'../../packages/studiocms_auth/src/integration.ts',
						]
					)
				),
				tdCore(
					makeTypeDocOptions(
						'@studiocms/core',
						'typedoc/studiocms-core',
						'../../packages/studiocms_core/tsconfig.json',
						[
							'../../packages/studiocms_core/src/index.ts',
							'../../packages/studiocms_core/src/integration.ts',
						]
					)
				),
				tdDashboard(
					makeTypeDocOptions(
						'@studiocms/dashboard',
						'typedoc/studiocms-dashboard',
						'../../packages/studiocms_dashboard/tsconfig.json',
						[
							'../../packages/studiocms_dashboard/src/index.ts',
							'../../packages/studiocms_dashboard/src/integration.ts',
						]
					)
				),
				tdFrontend(
					makeTypeDocOptions(
						'@studiocms/frontend',
						'typedoc/studiocms-frontend',
						'../../packages/studiocms_frontend/tsconfig.json',
						[
							'../../packages/studiocms_frontend/src/index.ts',
							'../../packages/studiocms_frontend/src/integration.ts',
						]
					)
				),
				tdImageHandler(
					makeTypeDocOptions(
						'@studiocms/imagehandler',
						'typedoc/studiocms-imagehandler',
						'../../packages/studiocms_imagehandler/tsconfig.json',
						[
							'../../packages/studiocms_imagehandler/src/index.ts',
							'../../packages/studiocms_imagehandler/src/integration.ts',
							'../../packages/studiocms_imagehandler/src/supportedAdapters.ts',
						]
					)
				),
				tdRenderers(
					makeTypeDocOptions(
						'@studiocms/renderers',
						'typedoc/studiocms-renderers',
						'../../packages/studiocms_renderers/tsconfig.json',
						[
							'../../packages/studiocms_renderers/src/index.ts',
							'../../packages/studiocms_renderers/src/integration.ts',
						]
					)
				),
				tdRobotsTxt(
					makeTypeDocOptions(
						'@studiocms/robotstxt',
						'typedoc/studiocms-robotstxt',
						'../../packages/studiocms_robotstxt/tsconfig.json',
						[
							'../../packages/studiocms_robotstxt/src/index.ts',
							'../../packages/studiocms_robotstxt/src/core.ts',
							'../../packages/studiocms_robotstxt/src/consts.ts',
							'../../packages/studiocms_robotstxt/src/utils/index.ts',
							'../../packages/studiocms_robotstxt/src/utils/measureExecutionTime.ts',
						]
					)
				),
				tdBlog(
					makeTypeDocOptions(
						'@studiocms/blog',
						'typedoc/studiocms-blog',
						'../../packages/studiocms_blog/tsconfig.json',
						['../../packages/studiocms_blog/index.ts', '../../packages/studiocms_blog/schema.ts']
					)
				),
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{
							label: 'Getting Started with StudioCMS',
							link: '/start-here/getting-started',
						},
						{
							label: 'Environment Variables',
							link: '/start-here/environment-variables',
						},
						{
							label: 'Configuration',
							link: '/start-here/configuration',
						},
						{
							label: 'Why Astro StudioCMS?',
							link: '/start-here/why-studiocms',
						},
						{
							label: 'Gallery',
							link: '/start-here/gallery',
						},
					],
				},
				{
					label: 'Plugins',
					items: [
						{
							label: 'Web Vitals',
							link: '/plugins/web-vitals',
							badge: {
								text: 'AstroJS',
								variant: 'success',
							},
						},
						{
							label: 'Blog Integration',
							link: '/plugins/studiocms-blog',
							badge: {
								text: 'StudioCMS',
								variant: 'tip',
							},
						},
					],
				},
				{
					label: 'Understanding StudioCMS',
					items: [
						{
							label: 'How does it work!?',
							link: '/how-it-works/',
						},
					],
				},
				{
					label: 'Configuration Reference',
					autogenerate: { directory: 'config-reference' },
					collapsed: true,
				},
				{
					label: 'TypeDoc',
					badge: {
						text: 'Auto-Generated',
						variant: 'success',
					},
					items: [
						{ label: 'Main Packages', items: MainProjectTypeDocSidebarGroup, collapsed: true },
						{ label: 'Plugins', items: PluginsTypeDocSidebarGroup, collapsed: true },
					],
				},
			],
			lastUpdated: true,
		}),
	],
});
