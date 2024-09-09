import type { ConfigType, ParserArgs, RenderableTreeNode } from '@markdoc/markdoc';
import { z } from 'astro/zod';

type markdocParserArgs = ParserArgs;
type markdocTransformConfig = ConfigType;

export type markdocRenderer = {
	name: string;
	renderer: (content: RenderableTreeNode) => Promise<string>;
};

//
// MARKDOC CONFIG SCHEMA
//
export const markdocConfigSchema = z
	.object({
		/**
		 * The MarkDoc Content Renderer to use for rendering pages and posts
		 *
		 * Can be one of the following: `html`, `react-static`, or a custom renderer
		 */
		renderType: z
			.union([z.literal('html'), z.literal('react-static'), z.custom<markdocRenderer>()])
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
	})
	.optional()
	.default({});
