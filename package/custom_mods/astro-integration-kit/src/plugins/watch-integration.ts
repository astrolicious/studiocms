import { definePlugin } from "../core/define-plugin.js";
import { watchIntegration } from "../utilities/watch-integration.js";

export const watchIntegrationPlugin = definePlugin({
	name: "watchIntegration",
	hook: "astro:config:setup",
	implementation:
		({ addWatchFile, command, updateConfig }) =>
		(dir: string) =>
			watchIntegration({ dir, command, addWatchFile, updateConfig }),
});
