import { defineUtility } from 'astro-integration-kit';
import { type StudioLoggerOptsResolverResponse, studioLogger } from '.';
import type { StudioCMSOptions } from '../schemas';
import { MakeFrontendStrings } from '../strings';

export type FrontendOptions = {
	resolvedOptions: StudioCMSOptions;
	LoggerOpts: StudioLoggerOptsResolverResponse;
	defaultRoutes: {
		pattern: string;
		entrypoint: string;
	}[];
	default404Route: string;
};

export const makeFrontend = defineUtility('astro:config:setup')(
	(params, options: FrontendOptions) => {
		// Destructure Params
		const { injectRoute } = params;

		// Destructure Options
		const {
			resolvedOptions: studioCMSOptions,
			LoggerOpts,
			defaultRoutes,
			default404Route,
		} = options;

		// Destructure StudioCMS Options
		const {
			dbStartPage,
			defaultFrontEndConfig: { injectDefaultFrontEndRoutes, inject404Route },
		} = studioCMSOptions;

		// Inject Default Routes
		if (!dbStartPage) {
			studioLogger(LoggerOpts.logInfo, MakeFrontendStrings.NoDBStartPage);

			// Inject Default Frontend Routes
			if (injectDefaultFrontEndRoutes) {
				studioLogger(LoggerOpts.logInfo, MakeFrontendStrings.InjectDefaultFrontendRoutes);
				for (const route of defaultRoutes) {
					injectRoute({
						pattern: route.pattern,
						entrypoint: route.entrypoint,
					});
				}
			}

			// Inject 404 Route
			if (inject404Route) {
				studioLogger(LoggerOpts.logInfo, MakeFrontendStrings.Inject404Route);
				injectRoute({
					pattern: '404',
					entrypoint: default404Route,
				});
			}

			studioLogger(LoggerOpts.logInfo, MakeFrontendStrings.DefaultRoutesInjected);
		}

		if (dbStartPage) {
			studioLogger(LoggerOpts.logWarn, MakeFrontendStrings.DBStartPageEnabled);
		}
	}
);
