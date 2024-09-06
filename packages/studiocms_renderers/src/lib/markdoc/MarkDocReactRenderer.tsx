import rendererConfig from 'studiocms:renderer/config';
import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';
import React from 'react';

const { reactComponents } = rendererConfig.markdocConfig;

export function MarkDocReactRenderer({ content }: { content: RenderableTreeNode }) {
	const renderedContent = Markdoc.renderers.react(content, React, { components: reactComponents });
	return renderedContent;
}

export default MarkDocReactRenderer;
