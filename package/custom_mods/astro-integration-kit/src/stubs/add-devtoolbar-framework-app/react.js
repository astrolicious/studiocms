import Component from "@@COMPONENT_SRC@@";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

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

		const root = createRoot(renderWindow);

		const componentElement = createElement(
			Component,
			{
				canvas,
				eventTarget,
				renderWindow,
			},
			[],
		);

		root.render(componentElement);
	},
};
