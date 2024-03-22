import Component from "@@COMPONENT_SRC@@";
import { Suspense, createApp, h } from "vue";

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

		const app = createApp({
			name: "${ virtualModuleName }",
			render() {
				let content = h(
					Component,
					{
						canvas,
						eventTarget,
						renderWindow,
					},
					{},
				);

				if (isAsync(Component.setup)) {
					content = h(Suspense, null, content);
				}

				return content;
			},
		});

		app.mount(renderWindow, true);
	},
};

/**
 * @param {(...args: any[]) => any} fn
 */
function isAsync(fn) {
	const _constructor = fn?.constructor;
	return _constructor && _constructor.name === "AsyncFunction";
}
