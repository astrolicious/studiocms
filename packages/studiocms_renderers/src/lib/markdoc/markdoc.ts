import { loadRenderers } from 'astro:container';
import rendererConfig from 'studiocms:renderer/config';
import { getContainerRenderer as reactContainerRenderer } from '@astrojs/react';
import Markdoc from '@markdoc/markdoc';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ReactWrapper from './ReactWrapper.astro';

// Destructure the Markdoc configuration from the rendererConfig
const {
	markdocConfig: { argParse, transformConfig, renderType },
} = rendererConfig;

export async function renderMarkDoc(input: string): Promise<string> {
	// Parse the input string into an AST
	const ast = Markdoc.parse(input, argParse);

	// Transform the AST into content
	const content = Markdoc.transform(ast, transformConfig);

	// Render the content based on the render type
	switch (renderType) {
		case 'html':
			return Markdoc.renderers.html(content);
		case 'react': {
			// Make a new Astro container with the React renderer
			const renderers = await loadRenderers([reactContainerRenderer()]);
			const container = await AstroContainer.create({ renderers });

			// Render the content to a HTML string
			const containerOutput = await container.renderToString(ReactWrapper, {
				props: { content: content },
			});

			// Return the rendered content
			return containerOutput || '';
		}
		default:
			throw new Error(`Unknown render type: ${renderType}`);
	}
}
