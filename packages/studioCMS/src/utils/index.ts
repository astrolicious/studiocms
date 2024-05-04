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

type AUTHKEYS = {
    GITHUBCLIENTID: {
        N: string;
        KEY: string | undefined;
    };
    GITHUBCLIENTSECRET: {
        N: string;
        KEY: string | undefined;
    };
};

export const CheckENV = async (logger: AstroIntegrationLogger, verbose: boolean, AUTHKEYS: AUTHKEYS) => {

	if ( verbose ) {
		integrationLogger(logger, verbose, 'info', 'Checking Environment Variables...');
	}

	// Check for Authenication Environment Variables
	if (!AUTHKEYS.GITHUBCLIENTID.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Github Authentication, you must set the ${AUTHKEYS.GITHUBCLIENTID.N} environment variable.`);
	}
	if (!AUTHKEYS.GITHUBCLIENTSECRET.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Github Authentication, you must set the ${AUTHKEYS.GITHUBCLIENTSECRET.N} environment variable.`);
	}
    if ( !AUTHKEYS.GITHUBCLIENTID.KEY || !AUTHKEYS.GITHUBCLIENTSECRET.KEY ) {
        integrationLogger(logger, verbose, "warn", "Github Environment Variables are not set. The built in Github Login Page will be disabled.")
    }

	if ( verbose ) {
		integrationLogger(logger, verbose, 'info', 'Done Checking Environment Variables...');
	}

};