import { HookParameters } from '../core/types.js';
import 'astro';
import '../internal/types.js';

type VirtualImport = {
    id: string;
    content: string;
    context?: "server" | "client" | undefined;
};
type Imports = Record<string, string> | Array<VirtualImport>;
type HookParameterProperties = Pick<HookParameters<"astro:config:setup">, "config" | "updateConfig">;
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
declare const addVirtualImports: ({ name, imports, config, updateConfig, }: HookParameterProperties & {
    name: string;
    imports: Imports;
}) => void;

export { addVirtualImports };
