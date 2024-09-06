import rendererConfig from 'studiocms:renderer/config';
import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';
import React from 'react';

const { reactComponents } = rendererConfig.markdocConfig;

export function MarkDocReactRenderer(content: RenderableTreeNode) {
	return Markdoc.renderers.react(content, React, { components: reactComponents });
}

export default MarkDocReactRenderer;
