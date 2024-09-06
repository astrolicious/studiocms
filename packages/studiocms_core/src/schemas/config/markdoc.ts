import type { ConfigType, ParserArgs } from '@markdoc/markdoc';
import { z } from 'astro/zod';

type markdocParserArgs = ParserArgs;
type markdocTransformConfig = ConfigType;

// biome-ignore lint/complexity/noBannedTypes: This is a valid use case for `any`
type markdocReactComponents = {} | undefined;

//
// MARKDOC CONFIG SCHEMA
//
export const markdocConfigSchema = z
	.object({
		/**
		 * The MarkDoc Content Renderer to use for rendering pages and posts
		 *
		 * Can be one of the following: `html`, `react-static`
		 */
		renderType: z
			.union([z.literal('html'), z.literal('react-static') /* z.literal('react')*/])
			.optional()
			.default('html'),
		/**
		 * The MarkDoc Arg Parse to use for rendering pages and posts
		 */
		argParse: z.custom<markdocParserArgs>().optional(),
		/**
		 * The MarkDoc Transform Config to use for rendering pages and posts
		 *
		 * @see https://markdoc.dev/docs/config
		 */
		transformConfig: z.custom<markdocTransformConfig>().optional(),
		/**
		 * The MarkDoc React Components to use for rendering pages and posts
		 */
		reactComponents: z.custom<markdocReactComponents>().optional(),
	})
	.optional()
	.default({});
