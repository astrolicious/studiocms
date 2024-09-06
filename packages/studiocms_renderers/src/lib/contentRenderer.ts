import type { Renderer } from '@studiocms/core/schemas/renderer';

type ContentRenderer = {
	content: string;
	renderer: Renderer;
};

/**
 * Content Renderer
 *
 * Renders content based on the renderer configuration
 *
 * @param content - The content to render
 * @param renderer - The renderer function to use
 * @returns The rendered content
 */
export async function contentRenderer({ content, renderer }: ContentRenderer): Promise<string> {
	// Assuming the renderer function processes the content and returns a string
	return renderer(content);
}

export default contentRenderer;

// Sample renderer function
// function sampleRenderer(content: string): string {
//     return `<p>${content}</p>`;
// }

// Using contentRenderer with the sample renderer
// const renderedContent = contentRenderer({
//     content: 'Hello, world!',
//     renderer: sampleRenderer,
// });
