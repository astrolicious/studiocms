import { Plugin } from './types.js';
import 'astro';
import '../internal/types.js';

/**
 * Allows defining a type-safe plugin that can be used in {defineIntegration}.
 *
 * @param {object} plugin
 * @param {string} plugin.name - The name of the plugin, as you want it to be called from the hook
 * @param {string} plugin.hook - The name of the hook where this plugin should be available
 * @param {Function} plugin.implementation - The actual function definition. Refer to docs for usage
 *
 * @see https://astro-integration-kit.netlify.app/utilities/define-plugin/
 *
 * ```ts
 * import { definePlugin } from "../core/define-plugin.js";
 * import { addVitePlugin } from "../utilities/add-vite-plugin.js";
 * import type { Plugin as VitePlugin } from "vite"
 *
 * export const addVitePluginPlugin = definePlugin({
 * 		name: "addVitePlugin",
 * 		hook: "astro:config:setup",
 * 		implementation: ({ updateConfig }) => (plugin: VitePlugin) => addVitePlugin({ plugin, updateConfig }),
 * });
 * ```
 */
declare const definePlugin: <TName extends string, THook extends "astro:config:setup" | "astro:config:done" | "astro:server:setup" | "astro:server:start" | "astro:server:done" | "astro:build:ssr" | "astro:build:start" | "astro:build:setup" | "astro:build:generated" | "astro:build:done" | "astro:db:setup", TImplementation extends (...args: Array<any>) => any>(plugin: Plugin<TName, THook, TImplementation>) => Plugin<TName, THook, TImplementation>;

export { definePlugin };
