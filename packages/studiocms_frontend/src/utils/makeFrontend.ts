import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { MakeFrontendStrings, type StudioCMSOptions } from '@studiocms/core';
import { defineUtility } from 'astro-integration-kit';

export const makeFrontend = defineUtility('astro:config:setup')(
	(
		params,
		options: {
			studioCMSOptions: StudioCMSOptions;
			routes: {
				pattern: string;
				entrypoint: string;
			}[];
			default404Route: string;
		}
	) => {
		// Destructure Params
		const { injectRoute, logger } = params;

		// Destructure Options
		const {
			routes,
			default404Route,
			studioCMSOptions: {
				dbStartPage,
				verbose,
				defaultFrontEndConfig: { injectDefaultFrontEndRoutes, inject404Route },
			},
		} = options;

		// Check if DB Start Page is enabled
		if (dbStartPage) {
			integrationLogger(
				{ logger, logLevel: 'info', verbose },
				MakeFrontendStrings.DBStartPageEnabled
			);
			return;
		}

		integrationLogger({ logger, logLevel: 'info', verbose }, MakeFrontendStrings.NoDBStartPage);

		// Inject Default Frontend Routes if Enabled
		if (injectDefaultFrontEndRoutes) {
			integrationLogger(
				{ logger, logLevel: 'info', verbose },
				MakeFrontendStrings.InjectDefaultFrontendRoutes
			);
			for (const route of routes) {
				injectRoute({
					pattern: route.pattern,
					entrypoint: route.entrypoint,
				});
			}

			// Inject 404 Route
			if (inject404Route) {
				integrationLogger(
					{ logger, logLevel: 'info', verbose },
					MakeFrontendStrings.Inject404Route
				);
				injectRoute({
					pattern: '404',
					entrypoint: default404Route,
				});
			}
			integrationLogger(
				{ logger, logLevel: 'info', verbose },
				MakeFrontendStrings.DefaultRoutesInjected
			);
		}
	}
);
