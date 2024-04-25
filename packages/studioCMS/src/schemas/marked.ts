import { z } from 'astro/zod';
import type { MarkedExtension } from 'marked';
import type { BundledTheme, ThemeInput } from 'shiki';

//
// MARKED EXTENSIONS SCHEMA
//
export const markedExtensionsSchema = z
	.object({
		/**
		 * Allows the user to enable/disable the use of the `marked-alert` extension
		 * @default true
		 * @see https://www.npmjs.com/package/marked-alert
		 */
		markedAlert: z.boolean().optional().default(true),
		/**
		 * Allows the user to enable/disable the use of the `marked-footnote` extension
		 * @default true
		 * @see https://www.npmjs.com/package/marked-footnote
		 */
		markedFootnote: z.boolean().optional().default(true),
		/**
		 * Allows the user to enable/disable the use of the `marked-smartypants` extension
		 * @default true
		 * @see https://www.npmjs.com/package/marked-smartypants
		 */
		markedSmartypants: z.boolean().optional().default(true),
		/**
		 * Allows the user to enable/disable the use of the `marked-emoji` extension
		 * @default true
		 * @see https://www.npmjs.com/package/marked-emoji
		 */
		markedEmoji: z.boolean().optional().default(true),
	})
	.optional()
	.default({});

//
// SHIKI CONFIG SCHEMA
//
export const shikiConfigSchema = z
	.object({
		/**
		 * Allows the user to choose a Shiki Theme
		 * 
		 * Import the theme from the `shiki` package
		 * @default theme: import('shiki/themes/houston.mjs') 
		 */
		theme: z.custom<BundledTheme>().optional().default("houston"),
	})
	.optional()
	.default({});

//
// MARKED HIGHLIGHTER CONFIG SCHEMA
//
export const markedHighlighterConfigSchema = z
	.object({
		/**
		 * Allows the user to choose between the `shiki` and Other eventually supported Highlighters
		 *
		 * Note: The Shiki Highlighter is from the `astro` package.
		 *
		 * @default 'shiki'
		 */
		highlighter: z.enum(['shiki']).optional().default('shiki'),
		/**
		 * Allows the user to configure the Shiki Highlighter
		 */
		shikiConfig: shikiConfigSchema,
	})
	.optional()
	.default({});

//
// MARKED CONFIG SCHEMA
//
export const markedConfigSchema = z
	.object({
		/**
		 * Allows Enabling and Disabling of the included Marked Extensions
		 */
		includedExtensions: markedExtensionsSchema,
		/**
		 * Allows the user to customize the current Marked Highlighter
		 */
		highlighterConfig: markedHighlighterConfigSchema,
		/**
		 * Allows the user to load additional Marked Extensions
		 *
		 * Note: This option is only used if the user wants to load additional Marked Extensions
		 *
		 * @see https://marked.js.org/using_advanced#extensions for more info about Marked Extensions
		 * @example
		 * ```ts
		 * import markedAlert from "marked-alert";
		 *
		 * loadmarkedExtensions: [ markedAlert() ]
		 * ```
		 */
		loadmarkedExtensions: z.array(z.custom<MarkedExtension>()).optional(),
	})
	.optional()
	.default({});
