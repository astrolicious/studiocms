import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc';
import starlightVersions from 'starlight-versions';
import { getCoolifyURL } from '../hostUtils';
import { savedVersions } from './savedVersions';
import { getFilePathToPackage, makeTypedocOpts } from './typedocHelpers';

// Create Starlight TypeDoc Plugins for different parts of the Astro StudioCMS Project
// studiocms TypeDoc Plugin
const [tdStudioCMS] = createStarlightTypeDocPlugin();
// @studiocms/core
const [tdCore] = createStarlightTypeDocPlugin();
// @studiocms/dashboard
const [tdDashboard] = createStarlightTypeDocPlugin();
// @studiocms/auth
const [tdAuth] = createStarlightTypeDocPlugin();
// @studiocms/frontend
const [tdFrontend] = createStarlightTypeDocPlugin();
// @studiocms/imagehandler
const [tdImageHandler] = createStarlightTypeDocPlugin();
// @studiocms/renderers
const [tdRenderers] = createStarlightTypeDocPlugin();
// @studiocms/robotstxt
const [tdRobotsTxt] = createStarlightTypeDocPlugin();

// Define the Site URL
const site = getCoolifyURL(true) || 'https://docs.studiocms.xyz/';

export default defineConfig({
	site,
	integrations: [
		starlight({
			title: 'StudioCMS',
			description: 'A dedicated CMS for Astro DB. Built from the ground up by the Astro community.',
			favicon: '/logo-light.svg',
			lastUpdated: true,
			credits: true,
			tagline: 'A dedicated CMS for Astro DB. Built from the ground up by the Astro community.',
			expressiveCode: {
				themes: ['material-theme-darker', 'starlight-light'],
				defaultProps: {
					wrap: true,
				},
			},
			components: {
				SiteTitle: './src/starlightOverrides/SiteTitle.astro',
			},
			logo: {
				dark: '../assets/logo-light.svg',
				light: '../assets/logo-dark.svg',
			},
			social: {
				github: 'https://github.com/astrolicious/studiocms',
				discord: 'https://chat.studiocms.xyz',
				youtube: 'https://www.youtube.com/@StudioCMS',
			},
			customCss: [
				'@fontsource-variable/onest/index.css',
				'./src/styles/custom.css',
				'@studiocms/ui/css/global.css'
			],
			editLink: {
				baseUrl: 'https://github.com/astrolicious/studiocms/tree/main/www/docs',
			},
			head: [
				{
					tag: 'script',
					attrs: {
						src: 'https://analytics.studiocms.xyz/script.js',
						'data-website-id': '00717cde-0d92-42be-8f49-8de0b1d810b2',
						defer: true,
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: `${site}og.jpg?v=1`,
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'twitter:image',
						content: `${site}og.jpg?v=1`,
					},
				},
			],
			sidebar: [
				{
					label: 'Start Here',
					autogenerate: { directory: 'start-here' },
				},
				{
					label: 'Plugins',
					autogenerate: { directory: 'plugins' },
				},
				{
					label: 'Customizing StudioCMS',
					items: [
						{
							label: '@studiocms/ui',
							items: [
								{ label: 'Getting Started', link: 'customizing/studiocms-ui/getting-started' },
								{ label: 'Components', autogenerate: { directory: 'customizing/studiocms-ui/components' } }
							]
						},
						{
							label: '@studiocms/renderers',
							autogenerate: { directory: 'customizing/studiocms-renderers' },
						},
					],
				},
				{
					label: 'Understanding StudioCMS',
					autogenerate: { directory: 'how-it-works' },
				},
				{
					label: 'Configuration Reference',
					autogenerate: { directory: 'config-reference' },
					collapsed: true,
				},
				{
					label: 'TypeDoc',
					badge: {
						text: 'Auto Generated',
						variant: 'tip',
					},
					collapsed: true,
					autogenerate: { directory: 'typedoc' },
				},
			],
			plugins: [
				starlightVersions({
					versions: savedVersions,
					current: { label: 'Latest' },
				}),
				tdStudioCMS(
					makeTypedocOpts({
						name: 'studiocms',
						output: 'studiocms',
						dir: 'studiocms',
						entryPoints: [
							getFilePathToPackage('studiocms', 'src/index.ts'),
							getFilePathToPackage('studiocms', 'src/integration.ts'),
							getFilePathToPackage('studiocms', 'src/updateCheck.ts'),
						],
					})
				),
				tdAuth(
					makeTypedocOpts({
						name: '@studiocms/auth',
						output: 'studiocms-integrations/auth',
						dir: 'studiocms_auth',
						entryPoints: [
							getFilePathToPackage('studiocms_auth', 'src/index.ts'),
							getFilePathToPackage('studiocms_auth', 'src/integration.ts'),
							getFilePathToPackage('studiocms_auth', 'src/middleware/index.ts'),
							getFilePathToPackage('studiocms_auth', 'src/middleware/router.ts'),
							getFilePathToPackage('studiocms_auth', 'src/auth/index.ts'),
							getFilePathToPackage('studiocms_auth', 'src/auth/lucia-astrodb-adapter.ts'),
							getFilePathToPackage('studiocms_auth', 'src/helpers/authHelper.ts'),
							getFilePathToPackage('studiocms_auth', 'src/astroenv/env.ts'),
							getFilePathToPackage('studiocms_auth', 'src/utils/authEnvCheck.ts'),
							getFilePathToPackage('studiocms_auth', 'src/utils/checkENV.ts'),
						],
					})
				),
				tdCore(
					makeTypedocOpts({
						name: '@studiocms/core',
						output: 'studiocms-integrations/core',
						dir: 'studiocms_core',
						entryPoints: [
							getFilePathToPackage('studiocms_core', 'src/index.ts'),
							getFilePathToPackage('studiocms_core', 'src/integration.ts'),
							getFilePathToPackage('studiocms_core', 'src/consts.ts'),
							getFilePathToPackage('studiocms_core', 'src/strings.ts'),
							getFilePathToPackage('studiocms_core', 'src/types/index.ts'),
							getFilePathToPackage('studiocms_core', 'src/types/auth-types.ts'),
							getFilePathToPackage('studiocms_core', 'src/types/dbtypehelpers.ts'),
							getFilePathToPackage('studiocms_core', 'src/types/locals.ts'),
							getFilePathToPackage('studiocms_core', 'src/types/pluginOptions.ts'),
							getFilePathToPackage('studiocms_core', 'src/types/sideBarLinkType.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/index.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/auth.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/componentoverrides.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/dashboard.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/defaultFrontend.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/developer.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/imageService.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/index.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/integrations.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/markdoc.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/marked.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/rendererConfig.ts'),
							getFilePathToPackage('studiocms_core', 'src/schemas/config/unocss.ts'),
							getFilePathToPackage('studiocms_core', 'src/lib/index.ts'),
							getFilePathToPackage('studiocms_core', 'src/lib/configManager.ts'),
							getFilePathToPackage('studiocms_core', 'src/lib/convertDashboardLinksType.ts'),
							getFilePathToPackage('studiocms_core', 'src/lib/defineStudioCMSConfig.ts'),
							getFilePathToPackage('studiocms_core', 'src/lib/head.ts'),
							getFilePathToPackage('studiocms_core', 'src/lib/jsonUtils.ts'),
							getFilePathToPackage('studiocms_core', 'src/lib/pluginSystem.ts'),
							getFilePathToPackage('studiocms_core', 'src/helpers/index.ts'),
							getFilePathToPackage('studiocms_core', 'src/helpers/authHelper.ts'),
							getFilePathToPackage('studiocms_core', 'src/helpers/contentHelper.ts'),
							getFilePathToPackage('studiocms_core', 'src/helpers/headDefaults.ts'),
							getFilePathToPackage('studiocms_core', 'src/helpers/pathGenerators.ts'),
							getFilePathToPackage('studiocms_core', 'src/helpers/routemap.ts'),
							getFilePathToPackage('studiocms_core', 'src/helpers/urlGen.ts'),
							getFilePathToPackage('studiocms_core', 'src/db/config.ts'),
							getFilePathToPackage('studiocms_core', 'src/db/tables.ts'),
							getFilePathToPackage('studiocms_core', 'src/db/tsTables.ts'),
							getFilePathToPackage('studiocms_core', 'src/components/index.ts'),
						],
					})
				),
				tdDashboard(
					makeTypedocOpts({
						name: '@studiocms/dashboard',
						output: 'studiocms-integrations/dashboard',
						dir: 'studiocms_dashboard',
						entryPoints: [
							getFilePathToPackage('studiocms_dashboard', 'src/index.ts'),
							getFilePathToPackage('studiocms_dashboard', 'src/integration.ts'),
							getFilePathToPackage('studiocms_dashboard', 'src/utils/webVital.ts'),
							getFilePathToPackage('studiocms_dashboard', 'src/utils/simpleResponse.ts'),
							getFilePathToPackage('studiocms_dashboard', 'src/utils/pageListPackageLabel.ts'),
							getFilePathToPackage('studiocms_dashboard', 'src/utils/makePageTitle.ts'),
							getFilePathToPackage('studiocms_dashboard', 'src/utils/isDashboardRoute.ts'),
							getFilePathToPackage('studiocms_dashboard', 'src/utils/astroDb.ts'),
							getFilePathToPackage('studiocms_dashboard', 'src/components/index.ts'),
						],
					})
				),
				tdFrontend(
					makeTypedocOpts({
						name: '@studiocms/frontend',
						output: 'studiocms-integrations/frontend',
						dir: 'studiocms_frontend',
						entryPoints: [
							getFilePathToPackage('studiocms_frontend', 'src/index.ts'),
							getFilePathToPackage('studiocms_frontend', 'src/integration.ts'),
							getFilePathToPackage('studiocms_frontend', 'src/components/index.ts'),
						],
					})
				),
				tdImageHandler(
					makeTypedocOpts({
						name: '@studiocms/imagehandler',
						output: 'studiocms-integrations/imagehandler',
						dir: 'studiocms_imagehandler',
						entryPoints: [
							getFilePathToPackage('studiocms_imagehandler', 'src/index.ts'),
							getFilePathToPackage('studiocms_imagehandler', 'src/integration.ts'),
							getFilePathToPackage('studiocms_imagehandler', 'src/supportedAdapters.ts'),
							getFilePathToPackage('studiocms_imagehandler', 'src/components/index.ts'),
							getFilePathToPackage('studiocms_imagehandler', 'src/adapters/cloudflare.ts'),
							getFilePathToPackage('studiocms_imagehandler', 'src/adapters/netlify.ts'),
							getFilePathToPackage('studiocms_imagehandler', 'src/adapters/node.ts'),
							getFilePathToPackage('studiocms_imagehandler', 'src/adapters/vercel.ts'),
						],
					})
				),
				tdRenderers(
					makeTypedocOpts({
						name: '@studiocms/renderers',
						output: 'studiocms-integrations/renderers',
						dir: 'studiocms_renderers',
						entryPoints: [
							getFilePathToPackage('studiocms_renderers', 'src/index.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/integration.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/components/index.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/exports/index.ts'),
							getFilePathToPackage(
								'studiocms_renderers',
								'src/exports/markdocRenderers/markdocReact.ts'
							),
							getFilePathToPackage('studiocms_renderers', 'src/lib/contentRenderer.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/lib/astro-remark/index.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/lib/markdoc/index.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/lib/markdoc/markdocHTML.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/lib/markdoc/markdocReactStatic.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/lib/marked/index.ts'),
							getFilePathToPackage('studiocms_renderers', 'src/lib/mdx/index.ts'),
						],
					})
				),
				tdRobotsTxt(
					makeTypedocOpts({
						name: '@studiocms/robotstxt',
						output: 'studiocms-integrations/robotstxt',
						dir: 'studiocms_robotstxt',
						entryPoints: [
							getFilePathToPackage('studiocms_robotstxt', 'src/index.ts'),
							getFilePathToPackage('studiocms_robotstxt', 'src/core.ts'),
							getFilePathToPackage('studiocms_robotstxt', 'src/consts.ts'),
							getFilePathToPackage('studiocms_robotstxt', 'src/utils/measureExecutionTime.ts'),
						],
					})
				),
			],
		}),
	],
});
