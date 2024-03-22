import { definePlugin } from "../core/define-plugin.js";
import { addVirtualImports } from "../utilities/add-virtual-imports.js";

export const addVirtualImportsPlugin = definePlugin({
	name: "addVirtualImports",
	hook: "astro:config:setup",
	implementation: ({ config, updateConfig }, { name }) => {
		return (imports: Parameters<typeof addVirtualImports>[0]["imports"]) => {
			addVirtualImports({
				name,
				imports,
				config,
				updateConfig,
			});
		};
	},
});
