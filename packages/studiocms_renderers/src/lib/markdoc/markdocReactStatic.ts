import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';
import type { markdocRenderer } from '@studiocms/core/schemas/renderer';

export function renderReactStatic(): markdocRenderer {
	return {
		name: 'react-static',
		renderer: async (content: RenderableTreeNode) => {
			return Markdoc.renderers.reactStatic(content);
		},
	};
}

export default renderReactStatic;
