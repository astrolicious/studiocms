import { HookParameters } from 'astro';
import { PluginOption } from 'vite';

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
declare const addVitePlugin: ({ warnDuplicated, plugin, config, logger, updateConfig, }: UnsafeOptions | SafeOptions) => void;

export { addVitePlugin };
