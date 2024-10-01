import { getCollection } from 'astro:content';
import type { APIContext, APIRoute, GetStaticPaths } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { decode } from 'html-entities';
import { html } from 'satori-html';
import OgImageTemplate from '../../../components/OgImageTemplate.astro';
import { satoriAstroOG } from '../../../lib/satoriOG';

export const getStaticPaths = (async () => {
	const blogPosts = await getCollection('blog');

	return blogPosts.map((post) => ({
		params: {
			slug: post.slug,
		},
		props: {
			post,
		},
	}));
}) satisfies GetStaticPaths;

// This function fetches a font file from a given base URL and path, and returns it as an ArrayBuffer.
const getPublicFonts = async (base: string, path: string) => {
	return await (await fetch(new URL(path, base))).arrayBuffer();
};

export const GET: APIRoute = async ({ props, url }: APIContext) => {
	const { post } = props;

	const astroContainer = await AstroContainer.create();

	return await satoriAstroOG({
		template: html(
			decode(
				await astroContainer.renderToString(OgImageTemplate, {
					props: { post, origin: url.origin },
				})
			)
		),
		width: 3840,
		height: 2160,
	}).toResponse({
		satori: {
			fonts: [
				{
					name: 'Onset',
					data: await getPublicFonts(url.origin, '/font/Onest-Bold.ttf'),
					weight: 700,
				},
				{
					name: 'Onset',
					data: await getPublicFonts(url.origin, '/font/Onest-Regular.ttf'),
					weight: 400,
				},
			],
		},
	});
};
