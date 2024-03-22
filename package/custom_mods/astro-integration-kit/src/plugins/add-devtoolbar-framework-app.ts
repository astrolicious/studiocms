import { definePlugin } from "../core/define-plugin.js";
import {
	type AddDevToolbarFrameworkAppParams,
	addDevToolbarFrameworkApp,
} from "../utilities/add-devtoolbar-framework-app.js";

export const addDevToolbarFrameworkAppPlugin = definePlugin({
	name: "addDevToolbarFrameworkApp",
	hook: "astro:config:setup",
	implementation:
		({ config, addDevToolbarApp, updateConfig, injectScript }) =>
		(
			params: Omit<
				AddDevToolbarFrameworkAppParams,
				"config" | "addDevToolbarApp" | "updateConfig" | "injectScript"
			>,
		) =>
			addDevToolbarFrameworkApp({
				...params,
				addDevToolbarApp,
				updateConfig,
				injectScript,
				config,
			}),
});
