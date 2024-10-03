import { defineCollection, reference, z } from 'astro:content';

const blogCollection = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().refine((value) => value.length < 50, {
				message: 'Description must be less than 50 characters',
			}),
			publishDate: z.date(),
			hero: z
				.object({
					image: image(),
					alt: z.string(),
				})
				.optional(),
			ogVariant: z
				.union([
					z.literal('accent'),
					z.literal('blue-purple'),
					z.literal('blue-yellow'),
					z.literal('fall'),
					z.literal('green-accent'),
					z.literal('red'),
					z.literal('spring'),
					z.literal('summer'),
					z.literal('winter'),
				])
				.optional(),
			author: reference('authors'),
			tags: z.array(z.string()).optional(),
		}),
});

const authorsCollection = defineCollection({
	type: 'data',
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			avatar: image(),
			link: z.string().url(),
		}),
});

const featuresCollection = defineCollection({
	type: 'data',
	schema: z.object({
		sortOrder: z.number(),
		feature: z.string(),
		description: z.string(),
		icon: z.string(),
	}),
});

// const testimonialsCollection = defineCollection({
// 	type: 'data',
// 	schema: ({ image }) =>
// 		z.object({
// 			name: z.string(),
// 			comment: z.string(),
// 			avatar: image(),
// 		}),
// });

export const collections = {
	blog: blogCollection,
	authors: authorsCollection,
	features: featuresCollection,
	// testimonials: testimonialsCollection,
};
