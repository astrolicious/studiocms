import rendererConfig from 'studiocms:renderer/config';
// import reactRenderer from '@astrojs/react/server.js';
import Markdoc from '@markdoc/markdoc';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import React from 'react';
import ReactWrapper from './ReactWrapper.astro';

// Destructure the Markdoc configuration from the rendererConfig
const {
	markdocConfig: { argParse, transformConfig, renderType, reactComponents },
} = rendererConfig;

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

	// Render the content based on the render type
	switch (renderType) {
		case 'html':
			return Markdoc.renderers.html(content);
		case 'react-static':
			return Markdoc.renderers.reactStatic(content);
		case 'react': {
			// Make a new Astro container with the React renderer
			return await import('@astrojs/react/server.js')
				.then(async (module) => {
					const container = await AstroContainer.create();
					container.addServerRenderer({
						name: '@astrojs/react',
						renderer: module.default,
					});
					container.addClientRenderer({
						name: '@astrojs/react',
						entrypoint: '@astrojs/react/client.js',
					});

					// Render the content to a React component
					const renderedContent = Markdoc.renderers.react(content, React, {
						components: reactComponents,
					});

					// Render the content to a HTML string
					const containerOutput = await container.renderToString(ReactWrapper, {
						props: { content: renderedContent },
					});

					// Return the rendered content
					return containerOutput || '';
				})
				.catch((error) => {
					console.error("[MarkDoc] Error importing '@astrojs/react/server.js'", error);
					return '';
				});
		}
		default:
			throw new Error(`Unknown render type: ${renderType}`);
	}
}

export default renderMarkDoc;
