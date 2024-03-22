import { AstroError } from "astro/errors";
import type { Plugin } from "vite";
import type { HookParameters } from "../core/types.js";
import { addVitePlugin } from "./add-vite-plugin.js";
import { hasVitePlugin } from "./has-vite-plugin.js";

type VirtualImport = {
	id: string;
	content: string;
	context?: "server" | "client" | undefined;
};

type Imports = Record<string, string> | Array<VirtualImport>;

const incrementPluginName = (name: string) => {
	let count = 1;
	return `${name.replace(/-(\d+)$/, (_, c) => {
		count = parseInt(c) + 1;
		return "";
	})}-${count}`;
};

const resolveVirtualModuleId = <T extends string>(id: T): `\0${T}` => {
	return `\0${id}`;
};

const createVirtualModule = (name: string, _imports: Imports): Plugin => {
	// We normalize the imports into an array
	const imports: Array<VirtualImport> = Array.isArray(_imports)
		? _imports
		: Object.entries(_imports).map(([id, content]) => ({
				id,
				content,
				context: undefined,
		  }));

	// We check for virtual imports with overlapping contexts, eg. several imports
	// with the same id and context server
	const duplicatedImports: Record<string, Array<string>> = {};
	for (const { id, context } of imports) {
		duplicatedImports[id] ??= [];
		duplicatedImports[id]?.push(
			...(context === undefined ? ["server", "client"] : [context]),
		);
	}
	for (const [id, contexts] of Object.entries(duplicatedImports)) {
		if (contexts.length !== [...new Set(contexts)].length) {
			throw new AstroError(
				`Virtual import with id "${id}" has been registered several times with conflicting contexts.`,
			);
		}
	}

	const resolutionMap = Object.fromEntries(
		imports.map(({ id }) => {
			if (id.startsWith("astro:")) {
				throw new AstroError(
					`Virtual import name prefix can't be "astro:" (for "${id}") because it's reserved for Astro core.`,
				);
			}

			return [resolveVirtualModuleId(id), id];
		}),
	);

	return {
		name,
		resolveId(id) {
			if (imports.find((_import) => _import.id === id)) {
				return resolveVirtualModuleId(id);
			}
			return;
		},
		load(id, options) {
			const resolution = resolutionMap[id];
			if (resolution) {
				const context = options?.ssr ? "server" : "client";
				const data = imports.find((_import) =>
					_import.id === resolution && _import.context === undefined
						? true
						: _import.context === context,
				);

				if (data) {
					return data.content;
				}
			}
			return;
		},
	};
};

type HookParameterProperties = Pick<
	HookParameters<"astro:config:setup">,
	"config" | "updateConfig"
>;

/**
 * Creates a Vite virtual module and updates the Astro config.
 * Virtual imports are useful for passing things like config options, or data computed within the integration.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {Imports} params.imports
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-imports/
 *
 * @example
 * ```ts
 * // my-integration/index.ts
 * import { addVirtualImports } from "astro-integration-kit";
 *
 * addVirtualImports(
 * 		name: 'my-integration',
 * 		config,
 * 		updateConfig,
 * 		imports: {
 * 			'virtual:my-integration/config': `export default ${ JSON.stringify({foo: "bar"}) }`,
 * 		}
 * );
 * ```
 *
 * This is then readable anywhere else in your integration:
 *
 * ```ts
 * // myIntegration/src/component/layout.astro
 * import config from "virtual:my-integration/config";
 *
 * console.log(config.foo) // "bar"
 * ```
 */
export const addVirtualImports = ({
	name,
	imports,
	config,
	updateConfig,
}: HookParameterProperties & {
	name: string;
	imports: Imports;
}) => {
	let pluginName = `vite-plugin-${name}`;

	while (hasVitePlugin({ plugin: pluginName, config }))
		pluginName = incrementPluginName(pluginName);

	addVitePlugin({
		warnDuplicated: false,
		plugin: createVirtualModule(pluginName, imports),
		updateConfig,
	});
};
