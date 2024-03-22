import { Plugin } from '../core/types.js';
import { AddIntegrationParams } from '../utilities/add-integration.js';
import 'astro';
import '../internal/types.js';

declare const addIntegrationPlugin: Plugin<"addIntegration", "astro:config:setup", (integration: Pick<AddIntegrationParams, "integration">["integration"], options?: Pick<AddIntegrationParams, "options">["options"]) => void>;

export { addIntegrationPlugin };
