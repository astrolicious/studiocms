import { fileURLToPath } from "node:url";
import { dirname, resolve } from "pathe";

/**
 * Allows resolving paths relatively to the integration folder easily. Call it like this:
 *
 * @param {string} _base - The location you want to create relative references from. `import.meta.url` is usually what you'll want.
 *
 * @see https://astro-integration-kit.netlify.app/utilities/create-resolver/
 *
 * @example
 * ```ts
 * const { resolve } = createResolver(import.meta.url);
 * const pluginPath = resolve("./plugin.ts");
 * ```
 *
 * This way, you do not have to add your plugin to your package.json `exports`.
 */
export const createResolver = (_base: string) => {
	let base = _base;
	if (base.startsWith("file://")) {
		base = dirname(fileURLToPath(base));
	}

	return {
		resolve: (...path: Array<string>) => resolve(base, ...path),
	};
};
