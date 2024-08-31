import { extname } from 'node:path';
import version from 'virtual:studiocms/version';
import type { AstroGlobalPartial } from 'astro';
import { AstroError } from 'astro/errors';
import type { z } from 'astro/zod';
import { lookup } from 'mrmime';
import type { HeadConfigSchema } from '../schemas/config/defaultFrontend';

type faviconTypeMap = '.ico' | '.gif' | '.jpeg' | '.jpg' | '.png' | '.svg';
const faviconTypes: faviconTypeMap[] = ['.ico', '.gif', '.jpeg', '.jpg', '.png', '.svg'];

function isFaviconExt(ext: string): ext is faviconTypeMap {
	if (faviconTypes.includes(ext as faviconTypeMap)) {
		return true;
	}
	return false;
}

const makeFavicon = (favicon: string) => {
	const ext = extname(favicon).toLocaleLowerCase();
	if (isFaviconExt(ext)) {
		const faviconHref = favicon;
		const faviconType = lookup(ext);
		return { href: faviconHref, type: faviconType };
	}
	throw new AstroError(
		`Unsupported favicon extension: ${ext}`,
		`The favicon must be one of the following types: ${faviconTypes.join(', ')}`
	);
};

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
	lang: string,
	Astro: AstroGlobalPartial,
	favicon: string,
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
		{
			tag: 'meta',
			attrs: { name: 'generator', content: `StudioCMS v${version}` },
		},
		// Favicon
		{
			tag: 'link',
			attrs: {
				rel: 'shortcut icon',
				href: makeFavicon(favicon).href,
				type: makeFavicon(favicon).type,
			},
		},
		// OpenGraph Tags
		{ tag: 'meta', attrs: { property: 'og:title', content: title } },
		{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
		{ tag: 'meta', attrs: { property: 'og:url', content: canonical?.href } },
		{ tag: 'meta', attrs: { property: 'og:locale', content: lang } },
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
