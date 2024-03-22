import { Plugin } from '../core/types.js';
import { AddDevToolbarFrameworkAppParams } from '../utilities/add-devtoolbar-framework-app.js';
import 'astro';
import '../internal/types.js';

declare const addDevToolbarFrameworkAppPlugin: Plugin<"addDevToolbarFrameworkApp", "astro:config:setup", (params: Omit<AddDevToolbarFrameworkAppParams, "config" | "addDevToolbarApp" | "updateConfig" | "injectScript">) => void>;

export { addDevToolbarFrameworkAppPlugin };
