import type { AstroIntegration } from "astro";
import { AstroError } from "astro/errors";
import { z } from "astro/zod";
import { errorMap } from "../internal/error-map.js";
import type {
	AnyPlugin,
	ExtendedHooks,
	HookParameters,
	Hooks,
} from "./types.js";

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
export const defineIntegration = <
	TOptionsSchema extends z.ZodTypeAny = z.ZodNever,
	TPlugins extends Array<AnyPlugin> = [],
>({
	name,
	optionsSchema,
	setup,
	plugins: _plugins,
}: {
	name: string;
	optionsSchema?: TOptionsSchema;
	plugins?: TPlugins;
	setup: (params: {
		name: string;
		options: z.output<TOptionsSchema>;
	}) => ExtendedHooks<TPlugins>;
}): ((
	...args: [z.input<TOptionsSchema>] extends [never]
		? []
		: undefined extends z.input<TOptionsSchema>
		  ? [options?: z.input<TOptionsSchema>]
		  : [options: z.input<TOptionsSchema>]
) => AstroIntegration) => {
	return (...args) => {
		const parsedOptions = (optionsSchema ?? z.never().optional()).safeParse(
			args[0],
			{
				errorMap,
			},
		);

		if (!parsedOptions.success) {
			throw new AstroError(
				`Invalid options passed to "${name}" integration\n`,
				parsedOptions.error.issues.map((i) => i.message).join("\n"),
			);
		}

		const options = parsedOptions.data as z.output<TOptionsSchema>;

		const resolvedPlugins = Object.values(
			(() => {
				const plugins: Record<string, AnyPlugin> = {};
				for (const plugin of _plugins ?? []) {
					plugins[plugin.name] = plugin;
				}
				return plugins;
			})(),
		);

		const providedHooks = setup({ name, options });

		const definedHooks = Object.keys(providedHooks) as Array<keyof Hooks>;

		const hooks: AstroIntegration["hooks"] = Object.fromEntries(
			definedHooks.map((hookName) => [
				hookName,
				// We know all hook parameters are objects, but the generic correlation makes TS ignore that fact.
				// The intersection with `object` is a workaround so TS doesn't complay about the spread below.
				(params: object & HookParameters<typeof hookName>) => {
					const plugins = resolvedPlugins.filter((p) => p.hook === hookName);

					return providedHooks[hookName]?.({
						...params,
						...Object.fromEntries(
							plugins.map((plugin) => [
								plugin.name,
								plugin.implementation(params, { name }),
							]),
						),
					} as any);
				},
			]),
		);

		return {
			name,
			hooks,
		};
	};
};
