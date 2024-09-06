// import { loadRenderers } from 'astro:container';
import rendererConfig from 'studiocms:renderer/config';
// import reactRenderer from '@astrojs/react/server.js';
// import { getContainerRenderer as reactRenderer } from '@astrojs/react';
import Markdoc from '@markdoc/markdoc';
// import { experimental_AstroContainer as AstroContainer } from 'astro/container';
// import ReactWrapper from './ReactWrapper.astro';

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
		case 'react-static':
			return Markdoc.renderers.reactStatic(content);
		// case 'react': {
		// 	// Make a new Astro container with the React renderer
		// 	// const renderers = await loadRenderers([reactRenderer()]);
		// 	const container = await AstroContainer.create();
		// 	container.addServerRenderer(reactRenderer);
		// 	container.addClientRenderer({
		// 		name: '@astrojs/react',
		// 		entrypoint: '@astrojs/react/client.js',
		// 	});

		// 	// Render the content to a HTML string
		// 	const containerOutput = await container.renderToString(ReactWrapper, {
		// 		props: { content: content },
		// 	});

		// 	// Return the rendered content
		// 	return containerOutput || '';
		// }
		default:
			throw new Error(`Unknown render type: ${renderType}`);
	}
}
