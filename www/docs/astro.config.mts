import starlight from '@astrojs/starlight';
import starlightUtils from '@lorenzo_lewis/starlight-utils';
import {
	transformerMetaHighlight,
	transformerMetaWordHighlight,
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';
import { defineConfig } from 'astro/config';
import JS from 'shiki/langs/javascript.mjs';
import TSX from 'shiki/langs/tsx.mjs';
import starlightImageZoom from 'starlight-image-zoom';
import { getCoolifyURL } from '../hostUtils';
import { addCopyButton, colorizedBrackets, metaTitle } from './src/shiki/transformers';
import { renderMarkdown, renderMarkdownInline } from './src/shiki/twoslashRenderers';
import { typeDocPlugins, typeDocSideBarEntry } from './typedoc.config';

// Define the Site URL
const site = getCoolifyURL(true) || 'https://docs.studiocms.xyz/';

export default defineConfig({
	site,
	experimental: {
		directRenderScript: true,
	},
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			wrap: true,
			langs: [...JS, ...TSX],
			themes: {
				light: 'light-plus',
				dark: 'dark-plus',
			},
			transformers: [
				addCopyButton(),
				metaTitle(),
				colorizedBrackets(),
				transformerMetaHighlight(),
				transformerMetaWordHighlight(),
				transformerNotationDiff(),
				transformerNotationHighlight(),
				transformerNotationWordHighlight(),
				transformerNotationErrorLevel(),
				transformerTwoslash({
					renderer: rendererRich({
						renderMarkdown,
						renderMarkdownInline,
					}),
					explicitTrigger: true,
					twoslashOptions: {
						compilerOptions: {
							// Set module resolution to "Bundler"
							moduleResolution: 100,
						},
					},
				}),
			],
		},
	},
	integrations: [
		starlight({
			title: 'StudioCMS',
			description: 'A dedicated CMS for Astro DB. Built from the ground up by the Astro community.',
			favicon: '/logo-light.svg',
			lastUpdated: true,
			credits: true,
			tagline: 'A dedicated CMS for Astro DB. Built from the ground up by the Astro community.',
			expressiveCode: false,
			components: {
				SiteTitle: './src/starlightOverrides/SiteTitle.astro',
				PageTitle: './src/starlightOverrides/PageTitle.astro',
				Sidebar: './src/starlightOverrides/SideBar.astro',
				Head: './src/starlightOverrides/Head.astro',
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
				'@shikijs/twoslash/style-rich.css',
				'@studiocms/ui/css/global.css',
				'./src/styles/shiki.css',
				'./src/styles/sponsorcolors.css',
				'./src/styles/starlight.css',
				'./src/styles/twoslash.css',
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
					label: 'Learn',
					items: [
						{
							label: 'Start Here',
							autogenerate: { directory: 'start-here' },
						},
						{
							label: 'Understanding StudioCMS',
							autogenerate: { directory: 'how-it-works' },
						},
						{
							label: 'Package Catalog',
							items: [
								{
									label: 'Package List',
									link: '/package-catalog',
									badge: { text: 'New', variant: 'success' },
								},
								{
									label: 'StudioCMS Integrations',
									autogenerate: { directory: 'package-catalog/studiocms-integrations' },
									collapsed: true,
								},
								{
									label: 'Community Integrations',
									autogenerate: { directory: 'package-catalog/community-integrations' },
									collapsed: true,
								},
							],
						},
						{
							label: 'Customizing StudioCMS',
							items: [
								{
									label: '@studiocms/renderers',
									autogenerate: { directory: 'customizing/studiocms-renderers' },
									collapsed: true,
								},
								{
									label: '@studiocms/ui',
									items: [
										{ label: 'Getting Started', link: 'customizing/studiocms-ui/' },
										{
											label: 'Components',
											autogenerate: {
												directory: 'customizing/studiocms-ui/components',
												collapsed: true,
											},
										},
									],
									collapsed: true,
								},
							],
						},
					],
				},
				{
					label: 'References',
					items: [
						{
							label: 'Configuration Reference',
							autogenerate: { directory: 'config-reference' },
							collapsed: false,
						},
						// @ts-expect-error - This is not a publicly available type
						typeDocSideBarEntry,
					],
				},
			],
			plugins: [
				starlightUtils({
					multiSidebar: { switcherStyle: 'horizontalList' },
				}),
				...typeDocPlugins,
				starlightImageZoom(),
			],
		}),
	],
});
