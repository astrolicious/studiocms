import astroMarkdownConfig from 'studiocms:renderer/astroMarkdownConfig';
import { type AstroMarkdownOptions, createMarkdownProcessor } from '@astrojs/markdown-remark';
import { HTMLString } from './html-string';

/**
 * Render Astro Markdown
 *
 * Renders Astro Markdown content
 *
 * Astro is the built-in Astro remark-markdown plugin.
 * @see https://www.npmjs.com/package/@astrojs/markdown-remark
 *
 * @param content - The content to render
 * @returns The rendered content
 */
export async function renderAstroMD(content: string) {
	const processor = await createMarkdownProcessor(astroMarkdownConfig as AstroMarkdownOptions);

	const result = await processor.render(content);
	return `${new HTMLString(result.code)}`;
}

export default renderAstroMD;
