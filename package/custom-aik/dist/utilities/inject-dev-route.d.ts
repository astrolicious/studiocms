import { InjectedRoute } from 'astro';
import { HookParameters } from '../core/types.js';
import '../internal/types.js';

type HookParameterProperties = Pick<HookParameters<"astro:config:setup">, "command" | "injectRoute">;
/**
 * Allows you to inject a route in development only
 *
 * @param {object} params
 * @param {import("astro").HookParameters<"astro:config:setup">["command"]} params.command
 * @param {import("astro").HookParameters<"astro:config:setup">["injectRoute"]} params.injectRoute
 * @param {import("astro").InjectedRoute} params.injectedRoute
 *
 * @example
 * ```ts
 * injectDevRoute({
 *      command,
 *      injectRoute,
 *      injectedRoute: {
 *          pattern: "/foo",
 *          entrypoint: resolve("./pages/foo.astro")
 *      },
 * })
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/inject-dev-route/
 */
declare const injectDevRoute: ({ command, injectRoute, injectedRoute, }: HookParameterProperties & {
    injectedRoute: InjectedRoute;
}) => void;

export { injectDevRoute };
