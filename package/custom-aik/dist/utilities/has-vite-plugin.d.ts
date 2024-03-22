import { HookParameters } from 'astro';
import { PluginOption } from 'vite';

/**
 * Checks for the existence of a Vite plugin inside the Astro config.
 *
 * @param {Params} params
 * @param {string|import("vite").PluginOption} params.plugin
 * @param {import("astro").HookParameters<"astro:config:setup">["config"]} params.config
 *
 * @see https://astro-integration-kit.netlify.app/utilities/has-vite-plugin/
 *
 * @example
 * ```ts
 * hasVitePlugin({
 * 		plugin: "vite-plugin-my-integration",
 * 		config
 * })
 * ```
 */
declare const hasVitePlugin: ({ plugin, config, }: {
    plugin: string | PluginOption;
    config: HookParameters<"astro:config:setup">["config"];
}) => boolean;

export { hasVitePlugin };
