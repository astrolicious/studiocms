import Component from '@@COMPONENT_SRC@@';

/**
 * @type {import('astro').DevToolbarApp}
 */
var svelte = {
	id: "@@ID@@",
	name: "@@NAME@@",
	icon: `@@ICON@@`,
	init(canvas, eventTarget) {
		const renderWindow = document.createElement("astro-dev-toolbar-window");

		canvas.appendChild(renderWindow);

		renderWindow.insertAdjacentHTML("beforebegin", `<style>@@STYLE@@</style>`);

		new Component({
			target: renderWindow,
			props: {
				canvas,
				eventTarget,
				renderWindow,
			},
		});
	},
};

export { svelte as default };
