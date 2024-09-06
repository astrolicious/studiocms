import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';
import type { markdocRenderer } from '@studiocms/core/schemas/renderer';

export function renderHTML(): markdocRenderer {
	return {
		name: 'html',
		renderer: async (content: RenderableTreeNode) => {
			return Markdoc.renderers.html(content);
		},
	};
}

export default renderHTML;
