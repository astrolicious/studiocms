import type { AstroConfig } from "astro";
import type { Plugin, PluginOption } from "vite";
import { definePlugin } from "../core/define-plugin.js";
import { hasVitePlugin } from "../utilities/has-vite-plugin.js";

function getPlugins(
	store: Set<Plugin<any>>,
	plugins: AstroConfig["vite"]["plugins"],
) {
	if (plugins) {
		for (const plugin of plugins) {
			if (!plugin) continue;

			if (Array.isArray(plugin)) {
				getPlugins(store, plugin);
				continue;
			}

			if (plugin instanceof Promise) {
				continue;
			}

			store.add(plugin);
		}
	}
	return store;
}

export const hasVitePluginPlugin = definePlugin({
	name: "hasVitePlugin",
	hook: "astro:config:setup",
	implementation: (params) => {
		const currentPlugins = getPlugins(new Set(), params.config.vite?.plugins);

		const { updateConfig, config } = params;

		params.updateConfig = (newConfig) => {
			config.vite.plugins = Array.from(
				getPlugins(currentPlugins, newConfig.vite?.plugins),
			);
			return updateConfig(newConfig);
		};

		return (plugin: string | PluginOption) =>
			hasVitePlugin({
				plugin,
				config,
			});
	},
});
