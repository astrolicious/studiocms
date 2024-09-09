import { z } from 'astro/zod';
import { markdocConfigSchema, type markdocRenderer } from './markdoc';
import { markedConfigSchema } from './marked';

export type Renderer = (content: string) => Promise<string>;
export type { markdocRenderer };

export type CustomRenderer = {
	name: string;
	renderer: Renderer;
};

/**
 * StudioCMS Renderer Configuration Schema
 *
 * Allows customization of the current renderer being used
 */
export const StudioCMSRendererConfigSchema = z
	.object({
		/**
		 * The Markdown Content Renderer to use for rendering pages and posts
		 *
		 * Marked is A markdown parser and compiler. Built for speed.
		 * @see https://marked.js.org/ for more info about marked.
		 *
		 * Astro is the built-in Astro remark-markdown plugin.
		 * @see https://www.npmjs.com/package/@astrojs/markdown-remark
		 *
		 * Markdoc is a powerful, flexible, Markdown-based authoring framework. Built by Stripe.
		 * @see https://markdoc.dev/ for more info about markdoc.
		 *
		 */
		renderer: z
			.union([
				z.literal('marked'),
				z.literal('astro'),
				z.literal('markdoc'),
				z.custom<CustomRenderer>(),
			])
			.optional()
			.default('marked'),
		/**
		 * Allows customization of the Marked Configuration
		 *
		 * Marked is a markdown parser and compiler. Built for speed. It is used to convert markdown strings into HTML for rendering content on StudioCMS pages.
		 * @see https://marked.js.org/ for more info about marked.
		 */
		markedConfig: markedConfigSchema,
		/**
		 * Allows customization of the Markdoc Configuration
		 *
		 * Markdoc is a powerful, flexible, Markdown-based authoring framework. Built by Stripe.
		 * @see https://markdoc.dev/ for more info about markdoc.
		 */
		markdocConfig: markdocConfigSchema,
	})
	.optional()
	.default({});

/**
 * Type for the StudioCMS Renderer Configuration
 */
export type StudioCMSRendererConfig = z.infer<typeof StudioCMSRendererConfigSchema>;
