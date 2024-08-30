import type { AstroIntegrationLogger } from 'astro';

export type StudioLoggerOpts = {
	logger: AstroIntegrationLogger;
	verbose: boolean;
	type: 'info' | 'warn' | 'error' | 'debug';
};

export type StudioLoggerOptsResolverResponse = {
	logInfo: StudioLoggerOpts;
	logWarn: StudioLoggerOpts;
	logError: StudioLoggerOpts;
	logDebug: StudioLoggerOpts;
};

export const studioLoggerOptsResolver = async (
	logger: AstroIntegrationLogger,
	verbose: boolean
): Promise<StudioLoggerOptsResolverResponse> => {
	const logInfo: StudioLoggerOpts = { logger, verbose, type: 'info' };
	const logWarn: StudioLoggerOpts = { logger, verbose, type: 'warn' };
	const logError: StudioLoggerOpts = { logger, verbose, type: 'error' };
	const logDebug: StudioLoggerOpts = { logger, verbose, type: 'debug' };

	return { logInfo, logWarn, logError, logDebug };
};

export const studioLogger = async (opts: StudioLoggerOpts, message: string) => {
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
};
