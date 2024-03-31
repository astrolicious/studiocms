// @ts-expect-error - Types are only available during runtime
import { SiteConfig, Blog, db } from 'astro:db';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = await db.select().from(Blog);
	const ConfigArray = await db.select().from(SiteConfig);
	const contextConfig = ConfigArray[0];
	return rss({
		title: contextConfig.title,
		description: contextConfig.description,
		site: context.site ?? 'https://example.com',
		items: posts.map((post: typeof Blog.$inferSelect) => ({
			title: post.title,
			description: post.description,
			link: `${import.meta.env.BASE_URL}blog/${post.slug || post.id}`,
			pubDate: post.publishedAt,
		})),
	});
}
