import type { AstroConfig } from 'astro';
import { AstroError } from 'astro/errors';
import { type StudioLoggerOptsResolverResponse, studioLogger } from '.';
import { CoreStrings, DbErrors } from '../strings';

export function checkAstroConfig(
	astroConfig: AstroConfig,
	LoggerOpts: StudioLoggerOptsResolverResponse
) {
	if (!astroConfig.integrations.find(({ name }) => name === 'astro:db')) {
		studioLogger(LoggerOpts.logError, DbErrors.astroDbMissingMessage);
		throw new AstroError(DbErrors.astroDbMissingMessage, DbErrors.astroDbMissingHint);
	}

	// Check for SSR Mode (output: "server")
	// TODO: Add support for "hybrid" mode
	if (astroConfig.output !== 'server') {
		studioLogger(LoggerOpts.logError, DbErrors.AstroConfigOutput);
		throw new AstroError(DbErrors.AstroConfigOutput);
	}

	// Check for Site URL
	if (!astroConfig.site) {
		studioLogger(LoggerOpts.logError, DbErrors.AstroConfigSiteURL);
		throw new AstroError(DbErrors.AstroConfigSiteURL);
	}

	return studioLogger(LoggerOpts.logInfo, CoreStrings.AstroConfigCheck);
}
