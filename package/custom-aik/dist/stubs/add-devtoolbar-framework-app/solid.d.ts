import Component from '@@COMPONENT_SRC@@';
import { render, createComponent } from 'solid-js/web';

/**
 * @type {import('astro').DevToolbarApp}
 */
var solid = {
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

export { solid as default };
