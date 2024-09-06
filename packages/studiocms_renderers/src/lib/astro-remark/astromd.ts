import astroMarkdownConfig from 'studiocms:renderer/astroMarkdownConfig';
import { type AstroMarkdownOptions, createMarkdownProcessor } from '@astrojs/markdown-remark';
import { HTMLString } from './html-string';

export async function renderAstroMD(content: string) {
	const processor = await createMarkdownProcessor(astroMarkdownConfig as AstroMarkdownOptions);

	const result = await processor.render(content);
	return new HTMLString(result.code);
}
