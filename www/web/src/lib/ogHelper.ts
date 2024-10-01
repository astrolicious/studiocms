import { getImage } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

export const ogPropsGenerator = async (post: CollectionEntry<'blog'>) => {
	let postOgImage = `/blog/${post.slug}/og.png`;
	let postOgDescription = post.data.description;

	if (post.data.hero) {
		const heroImage = post.data.hero.image;
		const heroImageWebp = (await getImage({ src: heroImage, format: 'webp' })).src;
		postOgImage = heroImageWebp;
		postOgDescription = post.data.hero.alt;
	}

	const imageProps = {
		src: postOgImage,
		alt: postOgDescription,
		width: 3840,
		height: 2160,
	};

	return imageProps;
};
