import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc';
import starlightVersions from 'starlight-versions';
import { getCoolifyURL } from '../hostUtils';

// Create Starlight TypeDoc Plugins for different parts of the Astro StudioCMS Project
//// MAIN PROJECT

// studiocms TypeDoc Plugin
const [tdStudioCMS, tdStudioCMSSideBar] = createStarlightTypeDocPlugin();
// @studiocms/core
const [tdCore, tdCoreSideBar] = createStarlightTypeDocPlugin();
// @studiocms/dashboard
const [tdDashboard, tdDashboardSideBar] = createStarlightTypeDocPlugin();
// @studiocms/auth
const [tdAuth, tdAuthSideBar] = createStarlightTypeDocPlugin();
// @studiocms/frontend
const [tdFrontend, tdFrontendSideBar] = createStarlightTypeDocPlugin();
// @studiocms/imagehandler
const [tdImageHandler, tdImageHandlerSideBar] = createStarlightTypeDocPlugin();
// @studiocms/renderers
const [tdRenderers, tdRenderersSideBar] = createStarlightTypeDocPlugin();
// @studiocms/robotstxt
const [tdRobotsTxt, tdRobotsTxtSideBar] = createStarlightTypeDocPlugin();

//// PLUGINS

// Define the Site URL
const site = getCoolifyURL(true) || 'https://docs.astro-studiocms.xyz/';

// Utility function to create TypeDoc related paths
function getFilePathToPackage(name: string, path: string) {
	return `../../packages/${name}/${path}`;
}

export default defineConfig({
	site,
	integrations: [
		starlight({
			title: 'Astro StudioCMS',
			description:
				'A dedicated CMS for Astro Studio. Built from the ground up by the Astro community.',
			favicon: '/logo-dark.svg',
			lastUpdated: true,
			credits: true,
			tagline: 'A dedicated CMS for Astro Studio. Built from the ground up by the Astro community.',
			expressiveCode: {
				themes: ['houston', 'starlight-light'],
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
				discord: 'https://chat.astrolicious.dev',
				youtube: 'https://www.youtube.com/@AstroStudioCMS',
			},
			customCss: ['./src/styles/custom.css'],
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
				starlightVersions({
					versions: [
						{ slug: '0.1.0-beta.4', label: 'Beta.4' },
						{ slug: '0.1.0-beta.5', label: 'Beta.5' },
					],
					current: { label: 'Latest' },
				}),
				tdStudioCMS({
					tsconfig: getFilePathToPackage('studiocms', 'tsconfig.json'),
					entryPoints: [
						getFilePathToPackage('studiocms', 'src/index.ts'),
						getFilePathToPackage('studiocms', 'src/integration.ts'),
						getFilePathToPackage('studiocms', 'src/updateCheck.ts'),
					],
					output: 'typedoc/studiocms',
					sidebar: {
						label: 'studiocms',
						collapsed: true,
					},
					pagination: true,
					typeDoc: {
						skipErrorChecking: true,
						sourceLinkTemplate:
							'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
					},
				}),
				tdAuth({
					tsconfig: getFilePathToPackage('studiocms_auth', 'tsconfig.json'),
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
					output: 'typedoc/studiocms-auth',
					sidebar: {
						label: '@studiocms/auth',
						collapsed: true,
					},
					pagination: true,
					typeDoc: {
						skipErrorChecking: true,
						sourceLinkTemplate:
							'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
					},
				}),
				tdCore({
					tsconfig: getFilePathToPackage('studiocms_core', 'tsconfig.json'),
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
					output: 'typedoc/studiocms_core',
					sidebar: {
						label: '@studiocms/core',
						collapsed: true,
					},
					pagination: true,
					typeDoc: {
						skipErrorChecking: true,
						sourceLinkTemplate:
							'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
					},
				}),
				tdDashboard({
					tsconfig: getFilePathToPackage('studiocms_dashboard', 'tsconfig.json'),
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
					output: 'typedoc/studiocms-dashboard',
					sidebar: {
						label: '@studiocms/dashboard',
						collapsed: true,
					},
					pagination: true,
					typeDoc: {
						skipErrorChecking: true,
						sourceLinkTemplate:
							'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
					},
				}),
				tdFrontend({
					tsconfig: getFilePathToPackage('studiocms_frontend', 'tsconfig.json'),
					entryPoints: [
						getFilePathToPackage('studiocms_frontend', 'src/index.ts'),
						getFilePathToPackage('studiocms_frontend', 'src/integration.ts'),
						getFilePathToPackage('studiocms_frontend', 'src/components/index.ts'),
					],
					output: 'typedoc/studiocms-frontend',
					sidebar: {
						label: '@studiocms/frontend',
						collapsed: true,
					},
					pagination: true,
					typeDoc: {
						skipErrorChecking: true,
						sourceLinkTemplate:
							'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
					},
				}),
				tdImageHandler({
					tsconfig: getFilePathToPackage('studiocms_imagehandler', 'tsconfig.json'),
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
					output: 'typedoc/studiocms-imagehandler',
					sidebar: {
						label: '@studiocms/imagehandler',
						collapsed: true,
					},
					pagination: true,
					typeDoc: {
						skipErrorChecking: true,
						sourceLinkTemplate:
							'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
					},
				}),
				tdRenderers({
					tsconfig: getFilePathToPackage('studiocms_renderers', 'tsconfig.json'),
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
					],
					output: 'typedoc/studiocms-renderers',
					sidebar: {
						label: '@studiocms/renderers',
						collapsed: true,
					},
					pagination: true,
					typeDoc: {
						skipErrorChecking: true,
						sourceLinkTemplate:
							'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
					},
				}),
				tdRobotsTxt({
					tsconfig: getFilePathToPackage('studiocms_robotstxt', 'tsconfig.json'),
					entryPoints: [
						getFilePathToPackage('studiocms_robotstxt', 'src/index.ts'),
						getFilePathToPackage('studiocms_robotstxt', 'src/core.ts'),
						getFilePathToPackage('studiocms_robotstxt', 'src/consts.ts'),
						getFilePathToPackage('studiocms_robotstxt', 'src/utils/measureExecutionTime.ts'),
					],
					output: 'typedoc/studiocms-robotstxt',
					sidebar: {
						label: '@studiocms/robotstxt',
						collapsed: true,
					},
					pagination: true,
					typeDoc: {
						skipErrorChecking: true,
						sourceLinkTemplate:
							'https://github.com/astrolicious/studiocms/tree/main/{path}#L{line}',
					},
				}),
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
						text: 'Auto-Generated',
						variant: 'success',
					},
					items: [
						tdStudioCMSSideBar,
						tdCoreSideBar,
						tdDashboardSideBar,
						tdAuthSideBar,
						tdFrontendSideBar,
						tdImageHandlerSideBar,
						tdRenderersSideBar,
						tdRobotsTxtSideBar,
					],
				},
			],
		}),
	],
});
