import { Plugin } from '../core/types.js';
import 'astro';
import '../internal/types.js';

declare const hasIntegrationPlugin: Plugin<"hasIntegration", "astro:config:setup", (_name: string, position?: "before" | "after", relativeTo?: string) => boolean>;

export { hasIntegrationPlugin };
