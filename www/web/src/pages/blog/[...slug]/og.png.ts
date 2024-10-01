import { getCollection } from 'astro:content';
import type { APIContext, APIRoute, GetStaticPaths } from 'astro';
import { html } from 'satori-html';
import { ogBG } from '../../../lib/base64strings';
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

export const GET: APIRoute = async ({ props }: APIContext) => {
	const { post } = props;

	const font400File = await fetch(
		'https://cdn.jsdelivr.net/fontsource/fonts/onest@latest/latin-400-normal.ttf'
	);
	const font400Data = await font400File.arrayBuffer();

	return await satoriAstroOG({
		template: html`<div style='width: 100%; height: 100%; position: relative; display:flex'>
				<img src=${ogBG} width="3840" height="2160" style='width: 100%; height: 100%; object-fit: cover; display: flex;' />
				<div style="left: 50%; top: 45%; transform: translate(-50%, -50%); position: absolute; color: white; font-size: 250px; font-family: Onest; font-weight: 700; word-wrap: break-word; display: flex; flex-direction: column; justify-items: center; align-items: center;">StudioCMS
				<p style="font-size: 100px; margin: 0; font-family: Onest; font-weight: 400;">${post.data.description}</p>
				</div></div>`,
		width: 3840,
		height: 2160,
	}).toResponse({
		satori: {
			fonts: [
				{
					name: 'Onset',
					data: font400Data,
					weight: 400,
				},
			],
		},
	});
};
