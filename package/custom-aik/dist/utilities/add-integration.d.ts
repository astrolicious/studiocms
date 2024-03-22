import { AstroIntegration, HookParameters } from 'astro';

type AddIntegrationParams = {
    integration: AstroIntegration;
    options?: {
        ensureUnique?: boolean;
    } | undefined;
} & Pick<HookParameters<"astro:config:setup">, "updateConfig" | "config" | "logger">;
/**
 * Easily add an integration from within an integration.
 *
 * @param {import("astro").AstroIntegration} integration
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 * @param {import("astro").HookParameters<"astro:config:setup">["config"]} params.config
 * @param {import("astro").HookParameters<"astro:config:setup">["logger"]} params.logger
 *
 * @example
 * ```ts
 * import Vue from "@astrojs/vue";
 *
 * addIntegration(Vue())
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-integration/
 */
declare const addIntegration: ({ integration, options, updateConfig, config, logger, }: AddIntegrationParams) => void;

export { type AddIntegrationParams, addIntegration };
