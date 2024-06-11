import type { AstroIntegrationLogger } from 'astro';

export const integrationLogger = async (
	logger: AstroIntegrationLogger,
	verbose: boolean,
	type: 'info' | 'warn' | 'error',
	message: string
) => {
	if (verbose) {
		if (type === 'info') {
			logger.info(message);
		} else if (type === 'warn') {
			logger.warn(message);
		} else if (type === 'error') {
			logger.error(message);
		}
	}
	if (!verbose) {
		if (type === 'warn') {
			logger.warn(message);
		} else if (type === 'error') {
			logger.error(message);
		}
	}
};