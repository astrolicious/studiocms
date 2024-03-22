import { definePlugin } from "../core/define-plugin.js";
import { hasIntegration } from "../utilities/has-integration.js";

export const hasIntegrationPlugin = definePlugin({
	name: "hasIntegration",
	hook: "astro:config:setup",
	implementation:
		({ config }, { name }) =>
		(_name: string, position?: "before" | "after", relativeTo?: string) =>
			hasIntegration({
				name: _name,
				// When `relativeTo` is not set get positions relative the current integration.
				relativeTo: relativeTo ?? name,
				position,
				config: config,
			}),
});
