/// <reference types="@astrojs/db" />
import { db } from 'astro:db';
import { tsPageContent, tsPageData } from '@studiocms/core/db/tsTables';
import type { Page } from '../../schema/wp-api';
import {
	ConvertToPageContent,
	ConvertToPageData,
	ConvertToPostContent,
	ConvertToPostData,
} from './converters';
import { apiEndpoint, fetchAll } from './utils';

export type PageData = typeof tsPageData.$inferInsert;
export type PageContent = typeof tsPageContent.$inferInsert;

const generatePageFromData = async (page: unknown) => {
	const pageData = await ConvertToPageData(page);
	const pageContent = await ConvertToPageContent(pageData, page);

	return { pageData, pageContent };
};

const generatePostFromData = async (post: unknown, useBlogPkg: boolean) => {
	const pageData = await ConvertToPostData(post, useBlogPkg);
	const pageContent = await ConvertToPostContent(pageData, post);

	return { pageData, pageContent };
};

const importPage = async (page: unknown) => {
	const { pageData, pageContent } = await generatePageFromData(page);

	const pageDataResult = await db
		.insert(tsPageData)
		.values(pageData)
		.returning({ id: tsPageData.id, title: tsPageData.title })
		.get();

	if (pageDataResult === undefined) {
		throw new Error('Failed to insert page data');
	}

	const pageContentResult = await db
		.insert(tsPageContent)
		.values(pageContent)
		.returning({ id: tsPageContent.id })
		.get();

	if (pageContentResult === undefined) {
		throw new Error('Failed to insert page content');
	}

	console.log('- Imported new page from WP-API:', pageDataResult.title);
};

export const importPagesFromWPAPI = async (endpoint: string) => {
	const url = apiEndpoint(endpoint, 'pages');
	const pages: Page[] = await fetchAll(url);

	console.log('pages', pages.length);

	try {
		for (const page of pages) {
			console.log('importing page:', page.title.rendered);
			await importPage(page);
		}
	} catch (error) {
		console.error('Failed to import pages from WP-API:', error);
	}
};

const importPost = async (post: unknown, useBlogPkg: boolean) => {
	const { pageData, pageContent } = await generatePostFromData(post, useBlogPkg);

	const pageDataResult = await db
		.insert(tsPageData)
		.values(pageData)
		.returning({ id: tsPageData.id, title: tsPageData.title })
		.get();

	if (pageDataResult === undefined) {
		throw new Error('Failed to insert post data');
	}

	const pageContentResult = await db
		.insert(tsPageContent)
		.values(pageContent)
		.returning({ id: tsPageContent.id })
		.get();

	if (pageContentResult === undefined) {
		throw new Error('Failed to insert post content');
	}

	console.log('- Imported new post from WP-API:', pageDataResult.title);
};

export const importPostsFromWPAPI = async (endpoint: string, useBlogPkg: boolean) => {
	const url = apiEndpoint(endpoint, 'posts');

	console.log('fetching posts from:', url.origin);

	const posts: Page[] = await fetchAll(url);

	console.log('posts', posts.length);

	try {
		for (const post of posts) {
			console.log('importing post:', post.title.rendered);
			await importPost(post, useBlogPkg);
		}
	} catch (error) {
		console.error('Failed to import posts from WP-API:', error);
	}
};
