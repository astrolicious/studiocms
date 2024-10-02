import { type CollectionEntry, getCollection } from 'astro:content';
import type { APIContext, APIRoute, GetStaticPaths } from 'astro';
import { html } from 'satori-html';
import ogAccent from '../../../lib/ogBackgrounds/accent.txt?raw';
import ogBluePurple from '../../../lib/ogBackgrounds/blue-purple.txt?raw';
import ogBlueYellow from '../../../lib/ogBackgrounds/blue-yellow.txt?raw';
import ogFall from '../../../lib/ogBackgrounds/fall.txt?raw';
import ogGreenAccent from '../../../lib/ogBackgrounds/green-accent.txt?raw';
import ogRed from '../../../lib/ogBackgrounds/red.txt?raw';
import ogSpring from '../../../lib/ogBackgrounds/spring.txt?raw';
import ogSummer from '../../../lib/ogBackgrounds/summer.txt?raw';
import ogWinter from '../../../lib/ogBackgrounds/winter.txt?raw';
import { satoriAstroOG } from '../../../lib/satoriOG';

export const variantSelector = (
	variant:
		| 'accent'
		| 'blue-purple'
		| 'blue-yellow'
		| 'fall'
		| 'green-accent'
		| 'red'
		| 'spring'
		| 'summer'
		| 'winter'
		| undefined
) => {
	switch (variant) {
		case 'accent':
			return ogAccent;
		case 'blue-purple':
			return ogBluePurple;
		case 'blue-yellow':
			return ogBlueYellow;
		case 'fall':
			return ogFall;
		case 'green-accent':
			return ogGreenAccent;
		case 'red':
			return ogRed;
		case 'spring':
			return ogSpring;
		case 'summer':
			return ogSummer;
		case 'winter':
			return ogWinter;
		default:
			return ogAccent;
	}
};

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
	const post: CollectionEntry<'blog'> = props.post;

	const font400File = await fetch(
		'https://cdn.jsdelivr.net/fontsource/fonts/onest@latest/latin-400-normal.ttf'
	);
	const font400Data = await font400File.arrayBuffer();

	const font800File = await fetch(
		'https://cdn.jsdelivr.net/fontsource/fonts/onest@latest/latin-800-normal.ttf'
	);

	const font800Data = await font800File.arrayBuffer();

	const variant = variantSelector(post.data.ogVariant);

	return await satoriAstroOG({
		template: html`
			<div style='width: 100%; height: 100%; position: relative; display:flex'>
				<img src=${variant} width="3840" height="2160" style='width: 100%; height: 100%; object-fit: cover; display: flex;' />
				<div style="left: 50%; top: 45%; transform: translate(-50%, -50%); position: absolute; color: white; font-size: 250px; font-family: Onest; font-weight: 800; word-wrap: break-word; display: flex; flex-direction: column; justify-items: center; align-items: center;">
					StudioCMS
					<p style="font-size: 100px; margin: 0; font-family: Onest; font-weight: 400;">${post.data.description}</p>
				</div>
			</div>`,
		width: 3840,
		height: 2160,
	}).toResponse({
		satori: {
			fonts: [
				{
					name: 'Onset',
					data: font400Data,
					weight: 400,
					style: 'normal',
				},
				{
					name: 'Onset',
					data: font800Data,
					weight: 800,
					style: 'normal',
				},
			],
		},
	});
};
