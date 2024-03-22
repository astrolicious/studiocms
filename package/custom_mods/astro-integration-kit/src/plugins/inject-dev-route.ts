import { definePlugin } from "../core/define-plugin.js";
import { injectDevRoute } from "../utilities/inject-dev-route.js";

export const injectDevRoutePlugin = definePlugin({
	name: "injectDevRoute",
	hook: "astro:config:setup",
	implementation:
		({ command, injectRoute }) =>
		(injectedRoute: Parameters<typeof injectDevRoute>[0]["injectedRoute"]) =>
			injectDevRoute({ command, injectRoute, injectedRoute }),
});
