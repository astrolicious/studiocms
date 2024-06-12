import type { z } from "astro/zod";
import type { HeadConfigSchema } from "../../schemas/defaultFrontend";
import version from "virtual:studiocms/version";
import type { AstroGlobalPartial } from "astro";

export const headDefaults = (
    title: string,
    description: string,
    lang: string,
    Astro: AstroGlobalPartial,
    getFavicon: { href: string; type: string },
    ogImage: string|undefined,
    canonical: URL|undefined,
) => {
    const headDefaults: z.input<ReturnType<typeof HeadConfigSchema>> = [
        { tag: 'meta', attrs: { charset: 'utf-8' } },
        {
            tag: 'meta',
            attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        },
        { tag: 'title', content: `${title}` },
        { tag: 'meta', attrs: { name: 'title', content: title} },
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
                href: getFavicon.href,
                type: getFavicon.type,
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
        { tag: 'meta', attrs: { name: 'twitter:image', content: ogImage } },
        )
    }

    return headDefaults;
}