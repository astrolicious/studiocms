import { toString as toStr } from 'hast-util-to-string';
import { h } from 'hastscript';
import { escape as esc } from 'html-escaper';
import type { Options as rehypeAutolinkHeadingsOptions } from 'rehype-autolink-headings';

const createSROnlyLabel = (text: string) => {
	return h('span', { 'is:raw': true, class: 'sr-only' }, `'Read the “', ${esc(text)}, '” section'`);
};

const AnchorLinkIcon = h(
	'span',
	{ ariaHidden: 'true', class: 'anchor-icon' },
	h(
		'svg',
		{ width: 16, height: 16, viewBox: '0 0 24 24' },
		h('path', {
			fill: 'currentcolor',
			d: 'm12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z',
		})
	)
);

export const autolinkConfig: rehypeAutolinkHeadingsOptions = {
	properties: {
		class: 'anchor-link',
	},
	behavior: 'after',
	group: ({ tagName }) =>
		h('div', {
			tabIndex: -1,
			class: `heading-wrapper level-${tagName}`,
		}),
	content: (heading) => [AnchorLinkIcon, createSROnlyLabel(toStr(heading))],
};
