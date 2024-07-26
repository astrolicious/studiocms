import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
// import starlightLinksValidator from 'starlight-links-validator'; // Disabled for now
import { type StarlightTypeDocOptions, createStarlightTypeDocPlugin } from 'starlight-typedoc';

// Create Starlight TypeDoc Plugins for different parts of the Astro StudioCMS Project
const [studioCMSTypeDoc, studioCMSTypeDocSidebarGroup] = createStarlightTypeDocPlugin();
const [studioCMSBlogTypeDoc, studioCMSBlogTypeDocSidebarGroup] = createStarlightTypeDocPlugin();
const [studioCMSAdminTypeDoc, studioCMSAdminTypeDocSidebarGroup] = createStarlightTypeDocPlugin();

// Create Sidebar Groups for the TypeDocs
const TypeDocSidebarGroup = [
	studioCMSTypeDocSidebarGroup,
	studioCMSBlogTypeDocSidebarGroup,
	studioCMSAdminTypeDocSidebarGroup,
];

// Define the Site URL
const site = process.env.COOLIFY_FQDN || 'https://docs.astro-studiocms.xyz/';

// Utility Function for TypeDoc Options
const makeTypeDocOptions = (
	label: string,
	urlPath: string,
	tsconfig: string,
	entryPoints: string[],
	readme?: string
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
			readme,
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
						'data-website-id': 'b2ca8ffa-2a9e-4743-a55f-9d8472214d90',
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
				studioCMSTypeDoc(
					makeTypeDocOptions(
						'StudioCMS-Core',
						'typedoc/studiocms-core',
						'../../packages/studioCMS/tsconfig.json',
						[
							'../../packages/studioCMS/src/index.ts',
							'../../packages/studioCMS/src/coreIntegration.ts',
							'../../packages/studioCMS/src/studiocms-config.ts',
							'../../packages/studioCMS/src/db/config.ts',
							'../../packages/studioCMS/src/db/tables.ts',
							'../../packages/studioCMS/src/components/headDefaults.ts',
							'../../packages/studioCMS/src/utils/renderers/contentRenderer.ts',
							'../../packages/studioCMS/src/utils/renderers/marked.ts',
							'../../packages/studioCMS/src/utils/renderers/markdoc.ts',
							'../../packages/studioCMS/src/utils/renderers/astromd.ts',
							'../../packages/studioCMS/src/utils/authhelper.ts',
							'../../packages/studioCMS/src/utils/contentHelper.ts',
						],
						'../../packages/studioCMS/README.md'
					)
				),
				studioCMSAdminTypeDoc(
					makeTypeDocOptions(
						'StudioCMS-Dashboard',
						'typedoc/studiocms-dashboard',
						'../../packages/studioCMS/tsconfig.json',
						[
							'../../packages/studioCMS/src/integrations/studioCMSDashboard/index.ts',
							'../../packages/studioCMS/src/integrations/studioCMSDashboard/schemas.ts',
							'../../packages/studioCMS/src/integrations/studioCMSDashboard/env.ts',
							'../../packages/studioCMS/src/integrations/studioCMSDashboard/lib/auth.ts',
							'../../packages/studioCMS/src/integrations/studioCMSDashboard/middleware/index.ts',
						]
					)
				),
				studioCMSBlogTypeDoc(
					makeTypeDocOptions(
						'StudioCMS-Blog',
						'typedoc/studiocms-blog',
						'../../packages/studioCMSBlog/tsconfig.json',
						[
							'../../packages/studioCMSBlog/index.ts',
							'../../packages/studioCMSBlog/schema.ts',
							'../../packages/studioCMSBlog/src/pages/rss.xml.ts',
						],
						'../../packages/studioCMSBlog/README.md'
					)
				),
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{
							label: 'Getting Started with Astro StudioCMS',
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
					items: TypeDocSidebarGroup,
				},
			],
			lastUpdated: true,
		}),
	],
});
