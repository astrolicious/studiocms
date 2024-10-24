import type { AstroGlobalPartial } from 'astro';
import { z } from 'astro/zod';

export const HeadConfigSchema = () =>
	z
		.array(
			z.object({
				/** Name of the HTML tag to add to `<head>`, e.g. `'meta'`, `'link'`, or `'script'`. */
				tag: z.enum(['title', 'base', 'link', 'style', 'meta', 'script', 'noscript', 'template']),
				/** Attributes to set on the tag, e.g. `{ rel: 'stylesheet', href: '/custom.css' }`. */
				attrs: z.record(z.union([z.string(), z.boolean(), z.undefined()])).default({}),
				/** Content to place inside the tag (optional). */
				content: z.string().default(''),
			})
		)
		.default([]);

/**
 * Default Head Tags for use with createHead() helper
 *
 * @param title
 * @param description
 * @param lang
 * @param Astro
 * @param favicon
 * @param ogImage
 * @param canonical
 * @returns
 */
export const headDefaults = (
	title: string,
	description: string,
	Astro: AstroGlobalPartial,
	ogImage: string | undefined,
	canonical: URL | undefined
) => {
	const headDefaults: z.input<ReturnType<typeof HeadConfigSchema>> = [
		{ tag: 'meta', attrs: { charset: 'utf-8' } },
		{
			tag: 'meta',
			attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' },
		},
		{ tag: 'title', content: `${title}` },
		{ tag: 'meta', attrs: { name: 'title', content: title } },
		{ tag: 'meta', attrs: { name: 'description', content: description } },
		{ tag: 'link', attrs: { rel: 'canonical', href: canonical?.href } },
		{ tag: 'meta', attrs: { name: 'generator', content: Astro.generator } },
		// Favicon
		{
			tag: 'link',
			attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
		},
		{
			tag: 'link',
			attrs: { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
		},
		{
			tag: 'link',
			attrs: { rel: 'icon', href: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
		},
		{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.png', type: 'image/png' } },
		{ tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
		{ tag: 'link', attrs: { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' } },
		{ tag: 'link', attrs: { rel: 'shortcut icon', href: '/favicon.ico' } },
		{ tag: 'meta', attrs: { name: 'msapplication-TileColor', content: '#da532c' } },
		{ tag: 'meta', attrs: { name: 'msapplication-config', content: '/browserconfig.xml' } },
		{ tag: 'meta', attrs: { name: 'theme-color', content: '#aa87f4' } },
		// OpenGraph Tags
		{ tag: 'meta', attrs: { property: 'og:title', content: title } },
		{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
		{ tag: 'meta', attrs: { property: 'og:url', content: canonical?.href } },
		{ tag: 'meta', attrs: { property: 'og:description', content: description } },
		{ tag: 'meta', attrs: { property: 'og:site_name', content: title } },
		// Twitter Tags
		{
			tag: 'meta',
			attrs: { name: 'twitter:card', content: 'summary_large_image' },
		},
		{ tag: 'meta', attrs: { name: 'twitter:url', content: canonical?.href } },
		{ tag: 'meta', attrs: { name: 'twitter:title', content: title } },
		{ tag: 'meta', attrs: { name: 'twitter:description', content: description } },
	];

	if (ogImage) {
		headDefaults.push(
			{ tag: 'meta', attrs: { property: 'og:image', content: ogImage } },
			{ tag: 'meta', attrs: { name: 'twitter:image', content: ogImage } }
		);
	}

	return headDefaults;
};

const HeadSchema = HeadConfigSchema();

export type HeadUserConfig = z.input<ReturnType<typeof HeadConfigSchema>>;
export type HeadConfig = z.output<ReturnType<typeof HeadConfigSchema>>;

/**
 * Test if a head config object contains a matching `<title>` or `<meta>` tag.
 *
 * For example, will return true if `head` already contains
 * `<meta name="description" content="A">` and the passed `tag`
 * is `<meta name="description" content="B">`. Tests against `name`,
 * `property`, and `http-equiv` attributes for `<meta>` tags.
 */
function hasTag(head: HeadConfig, entry: HeadConfig[number]): boolean {
	switch (entry.tag) {
		case 'title':
			return head.some(({ tag }) => tag === 'title');
		case 'meta':
			return hasOneOf(head, entry, ['name', 'property', 'http-equiv']);
		default:
			return false;
	}
}

/**
 * Test if a head config object contains a tag of the same type
 * as `entry` and a matching attribute for one of the passed `keys`.
 */
function hasOneOf(head: HeadConfig, entry: HeadConfig[number], keys: string[]): boolean {
	const attr = getAttr(keys, entry);
	if (!attr) return false;
	const [key, val] = attr;
	return head.some(({ tag, attrs }) => tag === entry.tag && attrs[key] === val);
}

/** Find the first matching key–value pair in a head entry’s attributes. */
function getAttr(
	keys: string[],
	entry: HeadConfig[number]
): [key: string, value: string | boolean] | undefined {
	let attr: [string, string | boolean] | undefined;
	for (const key of keys) {
		const val = entry.attrs[key];
		if (val) {
			attr = [key, val];
			break;
		}
	}
	return attr;
}

/** Merge two heads, overwriting entries in the first head that exist in the second. */
function mergeHead(oldHead: HeadConfig, newHead: HeadConfig) {
	return [...oldHead.filter((tag) => !hasTag(newHead, tag)), ...newHead];
}

/** Sort head tags to place important tags first and relegate “SEO” meta tags. */
function sortHead(head: HeadConfig) {
	return head.sort((a, b) => {
		const aImportance = getImportance(a);
		const bImportance = getImportance(b);
		return aImportance > bImportance ? -1 : bImportance > aImportance ? 1 : 0;
	});
}

/** Get the relative importance of a specific head tag. */
function getImportance(entry: HeadConfig[number]) {
	// 1. Important meta tags.
	if (
		entry.tag === 'meta' &&
		('charset' in entry.attrs || 'http-equiv' in entry.attrs || entry.attrs.name === 'viewport')
	) {
		return 100;
	}
	// 2. Page title
	if (entry.tag === 'title') return 90;
	// 3. Anything that isn’t an SEO meta tag.
	if (entry.tag !== 'meta') {
		// The default favicon should be below any extra icons that the user may have set
		// because if several icons are equally appropriate, the last one is used and we
		// want to use the SVG icon when supported.
		if (entry.tag === 'link' && 'rel' in entry.attrs && entry.attrs.rel === 'shortcut icon') {
			return 70;
		}
		return 80;
	}
	// 4. SEO meta tags.
	return 0;
}
/** Create a fully parsed, merged, and sorted head entry array from multiple sources. */
export function createHead(defaultHeaders: HeadUserConfig, ...heads: HeadConfig[]) {
	let head = HeadSchema.parse(defaultHeaders);
	for (const next of heads) {
		head = mergeHead(head, next);
	}
	return sortHead(head);
}
