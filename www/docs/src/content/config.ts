import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

const packageCatalog = defineCollection({
	type: 'data',
	schema: z.object({
		name: z.string(),
		description: z.string(),
		docsLink: z.string(),
		githubURL: z.string(),
		isScoped: z.boolean().optional().default(true),
		scope: z.string().optional().default('@studiocms'),
		catalog: z
			.union([z.literal('studiocms'), z.literal('studiocms-plugin'), z.literal('community-plugin')])
			.optional()
			.default('studiocms-plugin'),
		released: z.boolean().optional().default(true),
	}),
});

export const baseSchema = z.object({
	type: z.literal('base').optional().default('base'),
});

export const integrationSchema = baseSchema.extend({
	type: z.literal('integration'),
	githubIntegrationURL: z.string().url(),
	released: z.boolean().optional().default(true),
});

export const docsCollectionSchema = z.union([baseSchema, integrationSchema]);
export const collections = {
	docs: defineCollection({ schema: docsSchema({ extend: docsCollectionSchema }) }),
	'package-catalog': packageCatalog,
};
