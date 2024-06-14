import type { AstroConfig, AstroIntegrationLogger } from 'astro';
import { DbErrors } from '../strings';
import { AstroError } from 'astro/errors';
export * from './addExternalIntegration';

/** 
 * DEPRECATED: This Logger Function has been replaced by the `studioLogger` function.
 */
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

export type StudioLoggerOpts = {
	logger: AstroIntegrationLogger,
	verbose: boolean,
	type: 'info' | 'warn' | 'error' | 'debug',
};

export type StudioLoggerOptsResolverResponse = {
	logInfo: StudioLoggerOpts,
	logWarn: StudioLoggerOpts,
	logError: StudioLoggerOpts,
	logDebug: StudioLoggerOpts,
};

export const studioLoggerOptsResolver = async (
	logger: AstroIntegrationLogger,
	verbose: boolean,
): Promise<StudioLoggerOptsResolverResponse> => {
	const logInfo: StudioLoggerOpts = { logger, verbose, type: 'info' };
	const logWarn: StudioLoggerOpts = { logger, verbose, type: 'warn' };
	const logError: StudioLoggerOpts = { logger, verbose, type: 'error' };
	const logDebug: StudioLoggerOpts = { logger, verbose, type: 'debug' };

	return { logInfo, logWarn, logError, logDebug };
}

export const studioLogger = async (
	opts: StudioLoggerOpts,
	message: string
) => {
	if (opts.verbose) {
		if (opts.type === 'info') {
			opts.logger.info(message);
		} else if (opts.type === 'warn') {
			opts.logger.warn(message);
		} else if (opts.type === 'error') {
			opts.logger.error(message);
		} else if (opts.type === 'debug') {
			opts.logger.debug(message);
		}
	}
	if (!opts.verbose) {
		if (opts.type === 'warn') {
			opts.logger.warn(message);
		} else if (opts.type === 'error') {
			opts.logger.error(message);
		} else if (opts.type === 'debug') {
			opts.logger.debug(message);
		}
	}
}

export function checkAstroConfig(astroConfig: AstroConfig, LoggerOpts: StudioLoggerOptsResolverResponse) {

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

	return studioLogger(LoggerOpts.logInfo, 'Astro Config `output` & `site` options valid');
}