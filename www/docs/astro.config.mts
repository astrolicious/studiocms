import starlight from '@astrojs/starlight';
import starlightUtils from '@lorenzo_lewis/starlight-utils';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';
import { defineConfig } from 'astro/config';
import { getCoolifyURL } from '../hostUtils';
import { typeDocPlugins, typeDocSideBarEntry } from './typedoc.config';

import type { Element, ElementContent } from 'hast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { defaultHandlers, toHast } from 'mdast-util-to-hast';
import type { ShikiTransformerContextCommon } from 'shiki';

// Define the Site URL
const site = getCoolifyURL(true) || 'https://docs.studiocms.xyz/';

function renderMarkdown(this: ShikiTransformerContextCommon, md: string): ElementContent[] {
  const mdast = fromMarkdown(
    md.replace(/\{@link ([^}]*)\}/g, '$1'), // replace jsdoc links
    { mdastExtensions: [gfmFromMarkdown()] },
  )

  return (toHast(
    mdast,
    {
      handlers: {
        code: (state, node) => {
          const lang = node.lang || ''
          if (lang) {
            return {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: this.codeToHast(
                node.value,
                {
                  ...this.options,
                  transformers: [],
                  lang,
                  structure: node.value.trim().includes('\n') ? 'classic' : 'inline',
                },
              ).children,
            } as Element
          }
          return defaultHandlers.code(state, node)
        },
      },
    },
  ) as Element).children
}

function renderMarkdownInline(this: ShikiTransformerContextCommon, md: string, context?: string): ElementContent[] {
	let betterMD = md;
  if (context === 'tag:param')
    betterMD = md.replace(/^([\w$-]+)/, '`$1` ')

  const children = renderMarkdown.call(this, betterMD)
  if (children.length === 1 && children[0].type === 'element' && children[0].tagName === 'p')
    return children[0].children
  return children
}

export default defineConfig({
	site,
	experimental: {
		directRenderScript: true,
  },
	markdown: {
		shikiConfig: {
			themes: {
				light: 'light-plus',
				dark: 'dark-plus',
			},
			transformers: [
				// @ts-expect-error - Broken types
				transformerTwoslash({ 
					renderer: rendererRich({
						renderMarkdown,
						renderMarkdownInline,
					}),
					twoslashOptions: {
						compilerOptions: {
							// Set module resolution to "Bundler"
							moduleResolution: 100,
						},
					},
				}),
			],
			wrap: true,
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
				'@shikijs/twoslash/style-rich.css',
				'@studiocms/ui/css/global.css',
				'./src/styles/custom.css',
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
                    { label: 'Components', autogenerate: { directory: 'customizing/studiocms-ui/components', collapsed: true } }
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
			],
		}),
	],
});
