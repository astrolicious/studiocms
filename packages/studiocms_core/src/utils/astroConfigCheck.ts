import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { defineUtility } from 'astro-integration-kit';
import { AstroError } from 'astro/errors';
import { CoreStrings, DbErrors } from '../strings';

export const checkAstroConfig = defineUtility('astro:config:setup')(async (params) => {
	// Destructure Params
	const { config: astroConfig, logger } = params;

	// Check for Astro:DB Integration
	if (!astroConfig.integrations.find(({ name }) => name === 'astro:db')) {
		integrationLogger({ logger, logLevel: 'error', verbose: true }, DbErrors.astroDbMissingMessage);
		throw new AstroError(DbErrors.astroDbMissingMessage, DbErrors.astroDbMissingHint);
	}

	// Check for SSR Mode (output: "server")
	if (astroConfig.output !== 'server') {
		integrationLogger({ logger, logLevel: 'error', verbose: true }, DbErrors.AstroConfigOutput);
		throw new AstroError(DbErrors.AstroConfigOutput);
	}

	// Check for Site URL
	if (!astroConfig.site) {
		integrationLogger({ logger, logLevel: 'error', verbose: true }, DbErrors.AstroConfigSiteURL);
		throw new AstroError(DbErrors.AstroConfigSiteURL);
	}

	return integrationLogger(
		{ logger, logLevel: 'info', verbose: true },
		CoreStrings.AstroConfigCheck
	);
});
