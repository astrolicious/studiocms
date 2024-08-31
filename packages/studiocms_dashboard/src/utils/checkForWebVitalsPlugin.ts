import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { fileFactory } from '@matthiesenxyz/integration-utils/fileFactory';
import { webVitalStrings } from '@studiocms/core';
import {
	addVirtualImports,
	createResolver,
	defineUtility,
	hasIntegration,
} from 'astro-integration-kit';

const { resolve } = createResolver(import.meta.url);

export const checkForWebVitals = defineUtility('astro:config:setup')(
	(
		params,
		opts: {
			name: string;
			verbose: boolean;
		}
	) => {
		integrationLogger(
			{ logger: params.logger, logLevel: 'info', verbose: opts.verbose },
			webVitalStrings.checkForWebVitals
		);

		// Check for Web Vitals
		if (hasIntegration(params, { name: '@astrojs/web-vitals' })) {
			// Log that the Web Vitals Integration is Present
			integrationLogger(
				{ logger: params.logger, logLevel: 'info', verbose: opts.verbose },
				webVitalStrings.webVitalsFound
			);
		} else {
			// Log that the Web Vitals Integration is Missing
			integrationLogger(
				{ logger: params.logger, logLevel: 'warn', verbose: opts.verbose },
				webVitalStrings.webVitalsMissing
			);
		}

		// Add the Web Vitals StudioCMS interface
		addVirtualImports(params, {
			name: opts.name,
			imports: {
				'studiocms-dashboard:web-vitals': `export * from "${resolve('./webVital.ts')}"`,
			},
		});

		// Create the Web Vitals DTS File
		const webVitalDTS = fileFactory();
		webVitalDTS.addLines(`declare module 'studiocms-dashboard:web-vitals' {
                /** Type Definitions for getWebVitals helper function */
                export type WebVitalsResponseItem = import('${resolve('./webVital.ts')}').WebVitalsResponseItem;

                /** Get Web Vitals Helper function */
                export const getWebVitals: typeof import('${resolve('./webVital.ts')}').getWebVitals;
            };`);

		const webVitalDtsFile = webVitalDTS.text();

		return { webVitalDtsFile };
	}
);