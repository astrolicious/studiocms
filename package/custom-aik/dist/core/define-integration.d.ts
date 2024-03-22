import { AstroIntegration } from 'astro';
import { z } from 'astro/zod';
import { AnyPlugin, ExtendedHooks } from './types.js';
import '../internal/types.js';

/**
 * A powerful wrapper around the standard Astro Integrations API. It allows to provide extra hooks, functionality
 * and best-practices when creating Astro Integrations.
 *
 * @param {object} params
 * @param {string} params.name - The name of your integration
 * @param {import("astro/zod").AnyZodObject} params.optionsSchema - An optional zod schema to handle your integration options
 * @param {Array<AnyPlugin>} params.plugins - An optional array of plugins
 * @param {function} params.setup - This will be called from your `astro:config:setup` call with the user options
 *
 * @see https://astro-integration-kit.netlify.app/utilities/define-integration/
 *
 * @example
 * ```ts
 * export default defineIntegration({
 * 		name: "my-integration",
 * 		setup({ options }) {
 * 			console.log(options.foo); // "bar"
 * 		}
 * })
 * ```
 */
declare const defineIntegration: <TOptionsSchema extends z.ZodTypeAny = z.ZodNever, TPlugins extends AnyPlugin[] = []>({ name, optionsSchema, setup, plugins: _plugins, }: {
    name: string;
    optionsSchema?: TOptionsSchema;
    plugins?: TPlugins;
    setup: (params: {
        name: string;
        options: z.output<TOptionsSchema>;
    }) => ExtendedHooks<TPlugins>;
}) => (...args: [z.input<TOptionsSchema>] extends [
    never
] ? [
] : undefined extends z.input<TOptionsSchema> ? [options?: z.input<TOptionsSchema>] : [options: z.input<TOptionsSchema>]) => AstroIntegration;

export { defineIntegration };
