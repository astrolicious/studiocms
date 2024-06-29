import { z } from 'astro/zod';
import type { Config } from '@markdoc/markdoc';

//
// MARKDOC RENDER TYPE SCHEMA
//

export const markdocRenderTypeSchema = z
	.union([z.literal('html'), z.literal('react'), z.literal('react-static')])
	.optional()
	.default('html');

//
// MARKDOC ARG PARSE SCHEMA
//

export const markdocArgParseSchema = z
	.union([
		z.object({
			file: z.string(),
			slots: z.boolean(),
			location: z.boolean(),
		}),
		z.string(),
	])
	.optional();

//
// MARKDOC CONFIG SCHEMA
//
export const markdocConfigSchema = z
	.object({
		renderType: markdocRenderTypeSchema,
		argParse: markdocArgParseSchema,
		transformConfig: z.custom<Config>().optional(),
	})
	.optional()
	.default({});
