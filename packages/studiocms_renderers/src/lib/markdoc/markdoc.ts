import { logger } from '@it-astro:logger:studiocms-renderer';
import rendererConfig from 'studiocms:renderer/config';
import Markdoc from '@markdoc/markdoc';
import type { markdocRenderer } from '@studiocms/core/schemas/renderer';
import renderHTML from './markdocHTML';
import renderReactStatic from './markdocReactStatic';

// Destructure the Markdoc configuration from the rendererConfig
const {
	markdocConfig: { argParse, transformConfig, renderType },
} = rendererConfig;

const renderers: markdocRenderer[] = [renderHTML(), renderReactStatic()];

/**
 * Render a Markdown string into HTML using the Markdoc renderer
 *
 * Markdoc is a powerful, flexible, Markdown-based authoring framework. Built by Stripe.
 * @see https://markdoc.dev/ for more info about markdoc.
 *
 * @param input - The Markdown string to render
 * @returns The rendered HTML string
 */
export async function renderMarkDoc(input: string): Promise<string> {
	// Parse the input string into an AST
	const ast = Markdoc.parse(input, argParse);

	// Transform the AST into content
	const content = Markdoc.transform(ast, transformConfig);
	const renderer = renderers.find((r) => r.name === renderType);
	if (renderer) {
		logger.debug(`Rendering content with built-in renderer: ${renderer.name}`);
		return renderer.renderer(content);
	}
	if (
		renderType !== 'html' &&
		renderType !== 'react-static' &&
		renderType.name &&
		renderType.renderer
	) {
		logger.debug(`Rendering content with custom renderer: ${renderType.name}`);
		return renderType.renderer(content).catch((e) => {
			throw new Error(`Failed to render content with custom renderer: [${renderType.name}]: ${e}`);
		});
	}
	throw logger.error(`Unknown MarkDoc render type: ${renderType}`);
}

export default renderMarkDoc;
