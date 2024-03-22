import { Plugin } from '../core/types.js';
import { injectDevRoute } from '../utilities/inject-dev-route.js';
import 'astro';
import '../internal/types.js';

declare const injectDevRoutePlugin: Plugin<"injectDevRoute", "astro:config:setup", (injectedRoute: Parameters<typeof injectDevRoute>[0]["injectedRoute"]) => void>;

export { injectDevRoutePlugin };
