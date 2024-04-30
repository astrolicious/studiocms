import { z } from 'astro/zod';
import type { MarkedExtension } from 'marked';
import type { LanguageInput, BundledTheme, ThemeInput } from 'shiki';

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
		 * Allows the user to choose a Shiki Theme.
		 * 
		 * Note: The Only available themes are the ones listed below, and the user can import them from the `shiki` package. using loadTheme option.
		 * 
		 * ### Current Bundled Themes:
		 * - `houston`
		 * - `github-dark`
		 * - `github-light`
		 * - `night-owl`
		 * 
		 * Import the theme from the `shiki` package
		 * @default theme: "houston"
		 */
		theme: z.custom<BundledTheme>().optional().default("houston"),
		/**
		 * Allows the user to load additional Shiki Themes
		 *
		 * Note: This option is only used if the user wants to load additional Shiki Themes
		 *
		 * @example
		 * ```ts
		 * loadThemes: [ import('shiki/themes/github-dark-default.mjs'), import('shiki/themes/night-owl.mjs') ]
		 * ```
		 */
		loadThemes: z.array(z.custom<ThemeInput>()).optional(),
		/**
		 * Allows the user to load additional Shiki Languages
		 *
		 * Note: This option is only used if the user wants to load additional Shiki Languages
		 *
		 * @example
		 * ```ts
		 * loadLangs: [ import('shiki/languages/rust.mjs'), import('shiki/languages/scala.mjs') ]
		 * ```
		 */
		loadLangs: z.array(z.custom<LanguageInput>()).optional(),
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
		 * @default 'disabled'
		 */
		highlighter: z.enum(['shiki','disabled']).optional().default('disabled'),
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
