import { Plugin } from '../core/types.js';
import { PluginOption } from 'vite';
import 'astro';
import '../internal/types.js';

declare const hasVitePluginPlugin: Plugin<"hasVitePlugin", "astro:config:setup", (plugin: string | PluginOption) => boolean>;

export { hasVitePluginPlugin };
