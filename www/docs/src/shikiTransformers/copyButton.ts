import { h } from 'hastscript';
import type { ShikiTransformer } from 'shiki';

export function addCopyButton(options?: { toggle?: number }): ShikiTransformer {
	const toggleMs = options?.toggle || 3000;

	return {
		name: 'shiki-transformer-copy-button',
		pre(node) {
			const button = h(
				'button',
				{
					class: 'copy',
					'data-code': this.source,
					title: 'Copy code to clipboard',
					ariaLabel: 'Copy code to clipboard',
					onclick: `
          navigator.clipboard.writeText(this.dataset.code);
          this.classList.add('copied');
          setTimeout(() => this.classList.remove('copied'), ${toggleMs})
        `,
				},
				[
					h('span', { class: 'ready' }, [
						h(
							'svg',
							{ xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24' },
							[
								h('path', {
									d: 'M9 18q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm0-2h9V4H9v12Zm-4 6q-.825 0-1.413-.588T3 20V7q0-.425.288-.713T4 6q.425 0 .713.288T5 7v13h10q.425 0 .713.288T16 21q0 .425-.288.713T15 22H5Zm4-6V4v12Z',
									fill: 'var(--copy-button)',
								}),
							]
						),
					]),
					h('span', { class: 'success' }, [
						h(
							'svg',
							{ xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24' },
							[
								h('path', {
									d: 'm10.6 16.2l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Z',
									fill: 'var(--copy-button-success)',
								}),
							]
						),
					]),
				]
			);

			node.children.push(button);
		},
	};
}
