import { HookParameters } from 'astro';

/**
 * In development, will reload the Astro dev server if any files within
 * the integration directory has changed.
 *
 * @param {object} params
 * @param {string} params.dir
 * @param {import("astro").HookParameters<"astro:config:setup">["addWatchFile"]} params.addWatchFile
 * @param {import("astro").HookParameters<"astro:config:setup">["command"]} params.command
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 *
 * @see https://astro-integration-kit.netlify.app/utilities/watch-integration/
 *
 * @example
 * ```ts
 * watchIntegration({
 * 		dir: resolve(),
 * 		addWatchFile,
 * 		command,
 * 		updateConfig,
 * })
 * ```
 */
declare const watchIntegration: ({ addWatchFile, command, dir, updateConfig, }: {
    addWatchFile: HookParameters<"astro:config:setup">["addWatchFile"];
    command: HookParameters<"astro:config:setup">["command"];
    dir: string;
    updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}) => void;

export { watchIntegration };
