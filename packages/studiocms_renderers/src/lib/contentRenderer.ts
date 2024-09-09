import type { Renderer } from '@studiocms/core/schemas/renderer';

/**
 * Content Renderer Type
 *
 * Renders content based on the renderer configuration
 */
export type ContentRenderer = {
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
 *
 * @example
 * function sampleRenderer(content: string): Promise<string> {
 *   // Assuming the renderer function processes the content and returns a string
 *   return `<p>${content}</p>`;
 * }
 *
 * const renderedContent = contentRenderer({
 *   content: 'Hello, world!',
 *   renderer: sampleRenderer,
 * });
 */
export async function contentRenderer({ content, renderer }: ContentRenderer): Promise<string> {
	// Assuming the renderer function processes the content and returns a string
	return renderer(content);
}

export default contentRenderer;
