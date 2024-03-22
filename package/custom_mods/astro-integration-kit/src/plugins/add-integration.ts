import { definePlugin } from "../core/define-plugin.js";
import {
	type AddIntegrationParams,
	addIntegration,
} from "../utilities/add-integration.js";

export const addIntegrationPlugin = definePlugin({
	name: "addIntegration",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig, config, logger }) =>
		(
			integration: Pick<AddIntegrationParams, "integration">["integration"],
			options?: Pick<AddIntegrationParams, "options">["options"],
		) =>
			addIntegration({
				integration,
				options,
				updateConfig,
				config,
				logger,
			}),
});
