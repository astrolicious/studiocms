import DTSBuilder from '@matthiesenxyz/astrodtsbuilder';
import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { webVitalStrings } from '@studiocms/core/strings';
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

		const dtsFile = DTSBuilder();

		dtsFile.addSingleLineNote(
			'This file is generated by StudioCMS, And should not be modified manually'
		);

		dtsFile.addModule('studiocms-dashboard:web-vitals', {
			namedExports: [
				{
					name: 'getWebVitals',
					multiLineDescription: [
						'# Web Vitals Helper Function',
						'',
						'@returns Promise<WebVitalsResponseItem[]>',
					],
					typeDef: `typeof import('${resolve('./webVital.ts')}').getWebVitals`,
				},
			],
			typeExports: [
				{
					singleLineDescription: 'Web Vitals Response Item',
					typeDef: `import('${resolve('./webVital.ts')}').WebVitalsResponseItem`,
					name: 'WebVitalsResponseItem',
				},
			],
		});

		const webVitalDtsFile = dtsFile.makeAstroInjectedType('web-vitals.d.ts');

		return { webVitalDtsFile };
	}
);
