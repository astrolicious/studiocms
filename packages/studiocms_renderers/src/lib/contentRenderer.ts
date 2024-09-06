import { renderAstroMD } from './astro-remark/astromd';
import { renderMarkDoc } from './markdoc/markdoc';
import { renderMarked } from './marked/marked';

/**
 * Content Renderer
 *
 * Renders content based on the renderer configuration
 *
 * @param content - The content to render
 * @param renderer - The renderer to use
 * @returns The rendered content
 */
export function contentRenderer(content: string, renderer?: 'astro' | 'marked' | 'markdoc') {
	switch (renderer) {
		case 'astro': {
			return renderAstroMD(content);
		}
		case 'markdoc': {
			return renderMarkDoc(content);
		}
		case 'marked': {
			return renderMarked(content);
		}
		default: {
			return renderMarked(content);
		}
	}
}
