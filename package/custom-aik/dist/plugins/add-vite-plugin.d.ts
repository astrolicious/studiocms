import { Plugin } from '../core/types.js';
import { PluginOption } from 'vite';
import 'astro';
import '../internal/types.js';

declare const addVitePluginPlugin: Plugin<"addVitePlugin", "astro:config:setup", (plugin: PluginOption) => void>;

export { addVitePluginPlugin };
