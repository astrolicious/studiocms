import type { StudioCMSOptions } from '../../schemas';
import { renderAstroMD } from './astromd';
import { renderMarkDoc } from './markdoc';
import { renderMarked } from './marked';

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
