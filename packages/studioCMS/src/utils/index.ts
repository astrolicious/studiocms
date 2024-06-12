import type { AstroConfig, AstroIntegrationLogger } from 'astro';
import { DbErrors } from '../strings';
import { AstroError } from 'astro/errors';

export const integrationLogger = async (
	logger: AstroIntegrationLogger,
	verbose: boolean,
	type: 'info' | 'warn' | 'error' | 'debug',
	message: string
) => {
	if (verbose) {
		if (type === 'info') {
			logger.info(message);
		} else if (type === 'warn') {
			logger.warn(message);
		} else if (type === 'error') {
			logger.error(message);
		} else if (type === 'debug') {
			logger.debug(message);
		}
	}
	if (!verbose) {
		if (type === 'warn') {
			logger.warn(message);
		} else if (type === 'error') {
			logger.error(message);
		} else if (type === 'debug') {
			logger.debug(message);
		}
	}
};

export function checkAstroConfig(astroConfig: AstroConfig, logger: AstroIntegrationLogger) {

	// Check for SSR Mode (output: "server")
	// TODO: Add support for "hybrid" mode
	if (astroConfig.output !== 'server') {
		integrationLogger(logger, true, 'error', DbErrors.AstroConfigOutput);
		throw new AstroError(DbErrors.AstroConfigOutput);
	}

	// Check for Site URL
	if (!astroConfig.site) {
		integrationLogger(logger, true, 'error', DbErrors.AstroConfigSiteURL);
		throw new AstroError(DbErrors.AstroConfigSiteURL);
	}

	return integrationLogger(logger, true, 'info', 'Astro Config `output` & `site` options valid');
}