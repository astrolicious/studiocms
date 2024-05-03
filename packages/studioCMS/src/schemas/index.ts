import { z } from 'astro/zod';
import { authConfigSchema } from './auth';
import { imageServiceSchema } from './imageService';
import { includedIntegrationsSchema } from './integrations';
import { markedConfigSchema } from './marked';

//
// MAIN SCHEMA
//
export const optionsSchema = z
	.object({
		/**
		 * Project Initialization Page - Used during First Time Setup
		 * @default true
		 */
		dbStartPage: z.boolean().optional().default(true),
		/**
		 * The Markdown Content Renderer to use for rendering pages and posts
		 *
		 * Marked is A markdown parser and compiler. Built for speed.
		 * @see https://marked.js.org/ for more info about marked.
		 *
		 * Markdoc is a powerful, flexible, Markdown-based authoring framework. Built by Stripe.
		 * @see https://markdoc.dev/ for more info about markdoc.
		 */
		contentRenderer: z.enum(['markdoc', 'marked']).optional().default('marked'),
		/**
		 * Allows customization of the Marked Configuration
		 *
		 * Marked is a markdown parser and compiler. Built for speed. It is used to convert markdown strings into HTML for rendering content on StudioCMS pages.
		 * @see https://marked.js.org/ for more info about marked.
		 */
		markedConfig: markedConfigSchema,
		/**
		 * Allows customization of the Image Service Options
		 */
		imageService: imageServiceSchema,
		/**
		 * Allows customization of the Authentication Configuration
		 */
		authConfig: authConfigSchema,
		/**
		 * Allows enabling and disabling of the included integrations
		 */
		includedIntegrations: includedIntegrationsSchema,
		/**
		 * Date Locale used for formatting dates
		 */
		dateLocale: z.string().optional().default('en-us'),
		/**
		 * Component Overrides - Allows for customizing the components used in StudioCMS
		 */
		overrides: z.object({
			/**
			 * Allows overriding the default content renderer
			 */
			RendererOverride: z.string().optional(),
		}).optional().default({}),
		/**
		 * Whether to show verbose output
		 * @default false
		 */
		verbose: z.boolean().optional().default(false),
	})
	.optional()
	.default({});

export type StudioCMSOptions = z.infer<typeof optionsSchema>;
