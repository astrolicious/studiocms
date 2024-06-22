import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { StudioCMSRenderer, contentHelper, getPageList, getSiteConfig } from 'studiocms:components';
import config from 'studiocms-blog:config';
import { pathWithBase } from 'studiocms:helpers';
import { pages } from 'studiocms-blog:context';

import { experimental_AstroContainer as AstroContainer } from 'astro/container'

const blogRouteFullPath = pages.get('/blog/[...slug]')

function getBlogRoute(slug: string) {
	if (blogRouteFullPath) {
		return blogRouteFullPath.replace('[...slug]', slug);
	}
	return '#';
}

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

	// Render Known Posts
	const remappedPosts = await Promise.all(orderedPosts.map(async ({slug, title, description, publishedAt, package: pkg}) => {
		const { content: fetchedContent } = await contentHelper(slug, pkg);
		const container = await AstroContainer.create();
		const renderedContent = await container.renderToString(StudioCMSRenderer, {props: { content: fetchedContent }});

		const content = renderedContent
				.replace(/<!DOCTYPE html>/, '')
				.replace(/<html.*?>/, '')
				.replace(/<\/html>/, '')
				.trim();

		return {slug, title, description, publishedAt, content};
	}));
	
	return rss({
		title, description, site,
		items: remappedPosts.map(({ slug, title, description, publishedAt: pubDate, content }) => ({
			title, description, pubDate, content,
			link: pathWithBase(getBlogRoute(slug)),
		})),
	});
}