import rendererConfig from 'studiocms:renderer/config';
import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';
import type { markdocRenderer } from '@studiocms/core/schemas/renderer';

// Destructure the Markdoc configuration from the rendererConfig
const {
	markdocConfig: { argParse, transformConfig, renderType },
} = rendererConfig;

function renderHTML(): markdocRenderer {
	return {
		name: 'html',
		renderer: async (content: RenderableTreeNode) => {
			return Markdoc.renderers.html(content);
		},
	};
}

function renderReactStatic(): markdocRenderer {
	return {
		name: 'react-static',
		renderer: async (content: RenderableTreeNode) => {
			return Markdoc.renderers.reactStatic(content);
		},
	};
}

const renderers = [renderHTML(), renderReactStatic()];

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
		return renderer.renderer(content);
	}
	if (
		renderType !== 'html' &&
		renderType !== 'react-static' &&
		renderType.name &&
		renderType.renderer
	) {
		return renderType.renderer(content).catch((e) => {
			throw new Error(`Failed to render content with custom renderer: [${renderType.name}]: ${e}`);
		});
	}
	throw new Error(`Unknown render type: ${renderType}`);
}

export default renderMarkDoc;
