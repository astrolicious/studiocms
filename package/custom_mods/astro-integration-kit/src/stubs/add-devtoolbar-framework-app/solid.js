import Component from "@@COMPONENT_SRC@@";
import { createComponent, render } from "solid-js/web";

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
			() =>
				createComponent(Component, {
					props: {
						canvas,
						eventTarget,
						renderWindow,
					},
					slots: {},
				}),
			renderWindow,
		);
	},
};
