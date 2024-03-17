import { Blog, db } from 'astro:db';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import Config from 'virtual:astro-studio-cms:config';
import { getAstroBaseURL } from '../utils';

export async function GET(context: APIContext) {
	const posts = await db.select().from(Blog);
	return rss({
		title: Config.siteTitle,
		description: Config.siteDescription,
		site: context.site ?? 'https://example.com',
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			link: `${getAstroBaseURL()}blog/${post.slug || post.id}`,
			pubDate: post.publishedAt,
			content: post.content,
		})),
	});
}
