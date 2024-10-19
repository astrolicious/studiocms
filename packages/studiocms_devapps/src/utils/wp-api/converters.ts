import path from 'node:path';
import Config from 'virtual:studiocms-devapps/wp-api/configPath';
import { decode } from 'html-entities';
import TurndownService from 'turndown';
import type { Page, Post } from '../../schema/wp-api';
import type { PageContent, PageData } from './index';
import {
	apiEndpoint,
	cleanUpHtml,
	downloadAndUpdateImages,
	downloadPostImage,
	stripHtml,
} from './utils';

const ASTROPUBLICFOLDER = path.resolve(Config.projectRoot, 'public');
const WPImportFolder = path.resolve(ASTROPUBLICFOLDER, 'wp-import');
const pagesImagesFolder = path.resolve(WPImportFolder, 'pages');
const postsImagesFolder = path.resolve(WPImportFolder, 'posts');

export const ConvertToPageData = async (page: unknown): Promise<PageData> => {
	const data = page as Page;

	const titleImageId = data.featured_media;
	const titleImageURL = apiEndpoint(`${titleImageId}`, 'media');
	const titleImageResponse = await fetch(titleImageURL);
	const titleImageJson = await titleImageResponse.json();
	const titleImage = await downloadPostImage(titleImageJson.source_url, pagesImagesFolder);

	const pageData: PageData = {
		id: crypto.randomUUID(),
		title: data.title.rendered,
		description: decode(stripHtml(data.excerpt.rendered)),
		slug: data.slug,
		publishedAt: new Date(data.date_gmt),
		updatedAt: new Date(data.modified_gmt),
		showOnNav: false,
		contentLang: 'default',
		package: 'studiocms',
	};

	if (titleImage) {
		pageData.heroImage = titleImage;
	}

	return pageData;
};

export const ConvertToPageContent = async (
	pageData: PageData,
	page: unknown
): Promise<PageContent> => {
	const data = page as Page;

	if (pageData.id === undefined) {
		throw new Error('pageData is missing id');
	}

	const cleanupContent = cleanUpHtml(data.content.rendered);
	const htmlWithImages = await downloadAndUpdateImages(cleanupContent, pagesImagesFolder);

	const turndownService = new TurndownService({
		bulletListMarker: '-',
		codeBlockStyle: 'fenced',
		emDelimiter: '*',
	});

	const content = turndownService.turndown(htmlWithImages);

	const pageContent: PageContent = {
		id: crypto.randomUUID(),
		contentId: pageData.id,
		contentLang: 'default',
		content: content,
	};

	return pageContent;
};

export const ConvertToPostData = async (post: unknown, useBlogPkg: boolean): Promise<PageData> => {
	const data = post as Post;

	const titleImageId = data.featured_media;
	const titleImageURL = apiEndpoint(`${titleImageId}`, 'media');
	const titleImageResponse = await fetch(titleImageURL);
	const titleImageJson = await titleImageResponse.json();
	const titleImage = await downloadPostImage(titleImageJson.source_url, pagesImagesFolder);

	const pkg = useBlogPkg ? '@studiocms/blog' : 'studiocms';

	const pageData: PageData = {
		id: crypto.randomUUID(),
		title: data.title.rendered,
		description: decode(stripHtml(data.excerpt.rendered)),
		slug: data.slug,
		publishedAt: new Date(data.date_gmt),
		updatedAt: new Date(data.modified_gmt),
		showOnNav: false,
		contentLang: 'default',
		package: pkg,
	};

	if (titleImage) {
		pageData.heroImage = titleImage;
	}

	return pageData;
};

export const ConvertToPostContent = async (
	pageData: PageData,
	post: unknown
): Promise<PageContent> => {
	const data = post as Post;

	if (pageData.id === undefined) {
		throw new Error('pageData is missing id');
	}

	const cleanupContent = cleanUpHtml(data.content.rendered);
	const htmlWithImages = await downloadAndUpdateImages(cleanupContent, postsImagesFolder);

	const turndownService = new TurndownService({
		bulletListMarker: '-',
		codeBlockStyle: 'fenced',
		emDelimiter: '*',
	});

	const content = turndownService.turndown(htmlWithImages);

	const pageContent: PageContent = {
		id: crypto.randomUUID(),
		contentId: pageData.id,
		contentLang: 'default',
		content: content,
	};

	return pageContent;
};
