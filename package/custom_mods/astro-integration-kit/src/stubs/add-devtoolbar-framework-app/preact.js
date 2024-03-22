import Component from "@@COMPONENT_SRC@@";
import { h, render } from "preact";

/**
 * @type {import('astro').DevToolbarApp}
 */
export default {
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
