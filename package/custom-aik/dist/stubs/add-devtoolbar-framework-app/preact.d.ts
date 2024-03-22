import Component from '@@COMPONENT_SRC@@';
import { render, h } from 'preact';

/**
 * @type {import('astro').DevToolbarApp}
 */
var preact = {
	id: "@@ID@@",
	name: "@@NAME@@",
	icon: `@@ICON@@`,
	init(canvas, eventTarget) {
		const renderWindow = document.createElement("astro-dev-toolbar-window");

		canvas.appendChild(renderWindow);

		renderWindow.insertAdjacentHTML("beforebegin", `<style>@@STYLE@@</style>`);

		render(
			h(
				Component,
				{
					canvas,
					eventTarget,
					renderWindow,
				},
				[],
			),
			renderWindow,
		);
	},
};

export { preact as default };
