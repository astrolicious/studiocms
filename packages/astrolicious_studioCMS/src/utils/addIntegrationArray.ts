import type { AstroIntegration } from 'astro';
import { addIntegration, defineUtility } from 'astro-integration-kit';
import { type StudioLoggerOptsResolverResponse, studioLogger } from '.';

export const addIntegrationArray = defineUtility('astro:config:setup')(
	(
		params,
		opts: {
			LoggerOpts: StudioLoggerOptsResolverResponse;
			integrations: AstroIntegration[];
		}
	) => {
		for (const integration of opts.integrations) {
			studioLogger(opts.LoggerOpts.logInfo, `Injecting Integration: ${integration.name}`);
			addIntegration(params, { integration });
		}
	}
);
