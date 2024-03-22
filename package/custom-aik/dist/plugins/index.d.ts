import { AddDevToolbarFrameworkAppParams } from '../utilities/add-devtoolbar-framework-app.js';
import * as astro from 'astro';
import { Plugin } from '../core/types.js';
import * as vite from 'vite';
export { addDevToolbarFrameworkAppPlugin } from './add-devtoolbar-framework-app.js';
export { addDtsPlugin } from './add-dts.js';
export { addIntegrationPlugin } from './add-integration.js';
export { addVirtualImportsPlugin } from './add-virtual-imports.js';
export { addVitePluginPlugin } from './add-vite-plugin.js';
export { hasIntegrationPlugin } from './has-integration.js';
export { hasVitePluginPlugin } from './has-vite-plugin.js';
export { injectDevRoutePlugin } from './inject-dev-route.js';
export { watchIntegrationPlugin } from './watch-integration.js';
import '../internal/types.js';
import '../utilities/add-integration.js';
import '../utilities/add-virtual-imports.js';
import '../utilities/inject-dev-route.js';

declare const corePlugins: readonly [Plugin<"hasVitePlugin", "astro:config:setup", (plugin: string | vite.PluginOption) => boolean>, Plugin<"addDts", "astro:config:setup", ({ name, content }: {
    name: string;
    content: string;
}) => void>, Plugin<"addVirtualImports", "astro:config:setup", (imports: Record<string, string> | {
    id: string;
    content: string;
    context?: "server" | "client" | undefined;
}[]) => void>, Plugin<"addVitePlugin", "astro:config:setup", (plugin: vite.PluginOption) => void>, Plugin<"hasIntegration", "astro:config:setup", (_name: string, position?: "before" | "after" | undefined, relativeTo?: string | undefined) => boolean>, Plugin<"injectDevRoute", "astro:config:setup", (injectedRoute: astro.InjectedRoute) => void>, Plugin<"watchIntegration", "astro:config:setup", (dir: string) => void>, Plugin<"addDevToolbarFrameworkApp", "astro:config:setup", (params: Omit<AddDevToolbarFrameworkAppParams, "config" | "addDevToolbarApp" | "updateConfig" | "injectScript">) => void>, Plugin<"addIntegration", "astro:config:setup", (integration: astro.AstroIntegration, options?: {
    ensureUnique?: boolean;
} | undefined) => void>];

export { corePlugins };
