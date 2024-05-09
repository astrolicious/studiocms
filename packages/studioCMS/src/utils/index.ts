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
	DISCORDCLIENTID: {
		N: string;
		KEY: string | undefined;
	};
	DISCORDCLIENTSECRET: {
		N: string;
		KEY: string | undefined;
	};
	DISCORDREDIRECTURI: {
		N: string;
		KEY: string | undefined;
	};
	GOOGLECLIENTID: {
		N: string;
		KEY: string | undefined;
	};
	GOOGLECLIENTSECRET: {
		N: string;
		KEY: string | undefined;
	};
	GOOGLEREDIRECTURI: {
		N: string;
		KEY: string | undefined;
	};
	AUTH0CLIENTID: {
		N: string;
		KEY: string | undefined;
	};
	AUTH0CLIENTSECRET: {
		N: string;
		KEY: string | undefined;
	};
	AUTH0DOMAIN: {
		N: string;
		KEY: string | undefined;
	};
	AUTH0REDIRECTURI: {
		N: string;
		KEY: string | undefined;
	};
};

export const CheckENV = async (logger: AstroIntegrationLogger, verbose: boolean, AUTHKEYS: AUTHKEYS) => {

	if ( verbose ) {
		integrationLogger(logger, verbose, 'info', 'Checking Environment Variables...');
	}

	// Check for Authenication Environment Variables

	// Check for Github Environment Variables
	if (!AUTHKEYS.GITHUBCLIENTID.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Github Authentication, you must set the ${AUTHKEYS.GITHUBCLIENTID.N} environment variable.`);
	}
	if (!AUTHKEYS.GITHUBCLIENTSECRET.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Github Authentication, you must set the ${AUTHKEYS.GITHUBCLIENTSECRET.N} environment variable.`);
	}
    if ( !AUTHKEYS.GITHUBCLIENTID.KEY || !AUTHKEYS.GITHUBCLIENTSECRET.KEY ) {
        integrationLogger(logger, verbose, "warn", "Github Environment Variables are not set. The built in Github Login Page will be disabled.")
    }

	// Check for Discord Environment Variables
	if (!AUTHKEYS.DISCORDCLIENTID.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Discord Authentication, you must set the ${AUTHKEYS.DISCORDCLIENTID.N} environment variable.`);
	}
	if (!AUTHKEYS.DISCORDCLIENTSECRET.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Discord Authentication, you must set the ${AUTHKEYS.DISCORDCLIENTSECRET.N} environment variable.`);
	}
	if (!AUTHKEYS.DISCORDREDIRECTURI.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Discord Authentication, you must set the ${AUTHKEYS.DISCORDREDIRECTURI.N} environment variable.`);
	}
	if ( !AUTHKEYS.DISCORDCLIENTID.KEY || !AUTHKEYS.DISCORDCLIENTSECRET.KEY || !AUTHKEYS.DISCORDREDIRECTURI.KEY ) {
		integrationLogger(logger, verbose, "warn", "Discord Environment Variables are not set. The built in Discord Login Page will be disabled.")
	}

	// Check for Google Environment Variables
	if (!AUTHKEYS.GOOGLECLIENTID.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Google Authentication, you must set the ${AUTHKEYS.GOOGLECLIENTID.N} environment variable.`);
	}
	if (!AUTHKEYS.GOOGLECLIENTSECRET.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Google Authentication, you must set the ${AUTHKEYS.GOOGLECLIENTSECRET.N} environment variable.`);
	}
	if (!AUTHKEYS.GOOGLEREDIRECTURI.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Google Authentication, you must set the ${AUTHKEYS.GOOGLEREDIRECTURI.N} environment variable.`);
	}
	if ( !AUTHKEYS.GOOGLECLIENTID.KEY || !AUTHKEYS.GOOGLECLIENTSECRET.KEY || !AUTHKEYS.GOOGLEREDIRECTURI.KEY ) {
		integrationLogger(logger, verbose, "warn", "Google Environment Variables are not set. The built in Google Login Page will be disabled.")
	}

	// Check for Auth0 Environment Variables
	if (!AUTHKEYS.AUTH0CLIENTID.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Auth0 Authentication, you must set the ${AUTHKEYS.AUTH0CLIENTID.N} environment variable.`);
	}
	if (!AUTHKEYS.AUTH0CLIENTSECRET.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Auth0 Authentication, you must set the ${AUTHKEYS.AUTH0CLIENTSECRET.N} environment variable.`);
	}
	if (!AUTHKEYS.AUTH0DOMAIN.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Auth0 Authentication, you must set the ${AUTHKEYS.AUTH0DOMAIN.N} environment variable.`);
	}
	if (!AUTHKEYS.AUTH0REDIRECTURI.KEY) {
		integrationLogger(logger, verbose, 'error', `In order to use the Built-in Auth0 Authentication, you must set the ${AUTHKEYS.AUTH0REDIRECTURI.N} environment variable.`);
	}
	if ( !AUTHKEYS.AUTH0CLIENTID.KEY || !AUTHKEYS.AUTH0CLIENTSECRET.KEY || !AUTHKEYS.AUTH0DOMAIN.KEY || !AUTHKEYS.AUTH0REDIRECTURI.KEY ) {
		integrationLogger(logger, verbose, "warn", "Auth0 Environment Variables are not set. The built in Auth0 Login Page will be disabled.")
	}

	if ( verbose ) {
		integrationLogger(logger, verbose, 'info', 'Done Checking Environment Variables...');
	}

};