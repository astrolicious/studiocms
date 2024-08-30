import type { StudioCMSOptions } from '@studiocms/core';
import { renderAstroMD } from './astro-remark/astromd';
import { renderMarkDoc } from './markdoc/markdoc';
import { renderMarked } from './marked/marked';

export function contentRenderer(content: string, renderer: StudioCMSOptions['contentRenderer']) {
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
