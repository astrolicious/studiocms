import { AstroIntegrationLogger } from 'astro';

/**
 * Allows to inject .d.ts file in users project. It will create a file inside `.astro`
 * and reference it from `src/env.d.ts`.
 *
 * @param {object} params
 * @param {string} params.name - The name of the .d.ts file. Eg `test` will generate `.astro/test.d.ts`
 * @param {string} params.content
 * @param {URL} params.root
 * @param {URL} params.srcDir
 * @param {import("astro").AstroIntegrationLogger} params.logger
 *
 * @example
 * ```ts
 * addDts({
 * 		name: "my-integration",
 * 	 	content: `declare module "virtual:my-integration" {}`,
 * 	 	root,
 * 	 	srcDir,
 * 	 	logger
 * })
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-dts/
 */
declare const addDts: ({ name, content, root, srcDir, logger, }: {
    name: string;
    content: string;
    root: URL;
    srcDir: URL;
    logger: AstroIntegrationLogger;
}) => void;

export { addDts };
