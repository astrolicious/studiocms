import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { docsVersionsSchema } from 'starlight-versions/schema';

export const collections = {
	docs: defineCollection({ schema: docsSchema() }),
	versions: defineCollection({ type: 'data', schema: docsVersionsSchema() }),
};
