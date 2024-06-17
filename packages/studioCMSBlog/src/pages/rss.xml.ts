import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPageList, getSiteConfig } from 'studiocms:components';
import config from 'studiocms-blog:config';
import { pathWithBase } from 'studiocms:helpers';

export async function GET(context: APIContext) {

	// Get Config from Studio Database
    const studioCMSConfig = await getSiteConfig();

	// Set Title, Description, and Site
    const title = config.title ?? studioCMSConfig.title;
    const description = config.description ?? studioCMSConfig.description;
    const site = context.site ?? 'https://example.com';

	// Get all Posts from Studio Database
    const unorderedPosts = await getPageList();

	// Order Posts by Published Date
    const orderedPosts = unorderedPosts
		.filter(page => page.package === "@astrolicious/studiocms-blog")
		.sort((a, b) => Date.parse(b.publishedAt.toString()) - Date.parse(a.publishedAt.toString()));

	return rss({
		title, description, site,
		items: orderedPosts.map(({ slug, title, description, publishedAt: pubDate }) => ({
			title, description, pubDate,
			link: pathWithBase(`blog/${slug}`),
		})),
	});
}