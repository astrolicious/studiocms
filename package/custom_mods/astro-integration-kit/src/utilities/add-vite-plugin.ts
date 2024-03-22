import type { HookParameters } from "astro";
import type { Plugin, PluginOption } from "vite";
import { hasVitePlugin } from "./has-vite-plugin.js";

interface CommonOptions {
	plugin: PluginOption;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}

interface UnsafeOptions extends CommonOptions {
	warnDuplicated: false;
	config?: HookParameters<"astro:config:setup">["config"];
	logger?: HookParameters<"astro:config:setup">["logger"];
}

interface SafeOptions extends CommonOptions {
	warnDuplicated?: true;
	config: HookParameters<"astro:config:setup">["config"];
	logger: HookParameters<"astro:config:setup">["logger"];
}

/**
 * Adds a [vite plugin](https://vitejs.dev/guide/using-plugins) to the
 * Astro config.
 *
 * @param {Params} params
 * @param {boolean} [params.warnDuplicated=true]
 * @param {import("vite").PluginOption} params.plugin
 * @param {import("astro").HookParameters<"astro:config:setup">["config"]} params.config
 * @param {import("astro").HookParameters<"astro:config:setup">["logger"]} params.logger
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-vite-plugin/
 *
 * @example
 * ```ts
 * addVitePlugin({
 * 		plugin,
 * 		config,
 * 		logger,
 * 		updateConfig
 * })
 * ```
 */
export const addVitePlugin = ({
	warnDuplicated = true,
	plugin,
	config,
	logger,
	updateConfig,
}: UnsafeOptions | SafeOptions) => {
	if (warnDuplicated && config && logger && hasVitePlugin({ plugin, config })) {
		logger.warn(
			`The Vite plugin "${
				(plugin as Plugin).name
			}" is already present in your Vite configuration, this plugin may not behave correctly.`,
		);
	}

	updateConfig({
		vite: {
			plugins: [plugin],
		},
	});
};
