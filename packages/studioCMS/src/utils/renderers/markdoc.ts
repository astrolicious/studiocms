import Markdoc from '@markdoc/markdoc';
import Config from 'virtual:studiocms/config';
import React, { type ReactNode } from 'react';

const {
	markdocConfig: { argParse, renderType, transformConfig },
} = Config;

export async function renderMarkDoc(input: string): Promise<string | ReactNode> {
	const ast = Markdoc.parse(input, argParse);
	const content = Markdoc.transform(ast, transformConfig);

	switch (renderType) {
		case 'react':
			return Markdoc.renderers.react(content, React);
		case 'react-static':
			return Markdoc.renderers.reactStatic(content);
		case 'html':
			return Markdoc.renderers.html(content);
		default:
			throw new Error('Unsupported Markdoc type');
	}
}
