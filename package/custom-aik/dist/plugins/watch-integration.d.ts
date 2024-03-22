import { Plugin } from '../core/types.js';
import 'astro';
import '../internal/types.js';

declare const watchIntegrationPlugin: Plugin<"watchIntegration", "astro:config:setup", (dir: string) => void>;

export { watchIntegrationPlugin };
