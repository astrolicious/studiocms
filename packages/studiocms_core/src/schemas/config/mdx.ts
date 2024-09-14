import { z } from 'astro/zod';
import type { PluggableList } from 'unified';

// Get the type of the remark-rehype options
type ToHastOptions = import('mdast-util-to-hast').Options;
type RemarkRehypeOptions = Omit<ToHastOptions, 'file'>;

/**
 * MDX Configuration Schema
 *
 * Allows customization of the MDX renderer
 */
export const mdxConfigSchema = z
	.object({
		/** List of remark plugins (optional). */
		remarkPlugins: z.custom<PluggableList>().optional().default([]),
		/** List of rehype plugins (optional). */
		rehypePlugins: z.custom<PluggableList>().optional().default([]),
		/** List of recma plugins (optional); this is a new ecosystem, currently in beta, to transform esast trees (JavaScript) */
		recmaPlugins: z.custom<PluggableList>().optional().default([]),
		/** Options to pass through to remark-rehype (optional); the option allowDangerousHtml will always be set to true and the MDX nodes (see nodeTypes) are passed through; In particular, you might want to pass configuration for footnotes if your content is not in English. */
		remarkRehypeOptions: z.custom<RemarkRehypeOptions>().optional().default({}),
	})
	.optional()
	.default({});
