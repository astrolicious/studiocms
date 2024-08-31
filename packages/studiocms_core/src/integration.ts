import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { createResolver, defineIntegration } from 'astro-integration-kit';
import { version } from '../package.json';
import { StudioCMSOptionsSchema } from './schemas';
import { CoreStrings } from './strings';
import { coreVirtualModuleGeneration } from './utils/coreVirtualModules';

export default defineIntegration({
	name: '@studiocms/core',
	optionsSchema: StudioCMSOptionsSchema,
	setup({ name, options, options: { verbose } }) {
		let coreDtsFile: string;

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					// Destructure Params
					const {
						config: {
							root: { pathname: astroConfigPath },
						},
						logger,
					} = params;

					// Create resolver to resolve to the Astro Config
					const { resolve: astroConfigResolved } = createResolver(astroConfigPath);

					// Setup Virtual Imports
					integrationLogger({ logger, logLevel: 'info', verbose }, CoreStrings.AddVirtualImports);
					const { dtsFileOutput } = coreVirtualModuleGeneration(params, name, {
						StudioCMSConfig: options,
						currentVersion: version,
						overrides: {
							FormattedDateOverride:
								options.overrides.FormattedDateOverride &&
								astroConfigResolved(options.overrides.FormattedDateOverride),
						},
					});

					// Set the DTS File
					coreDtsFile = dtsFileOutput;
				},
				'astro:config:done': async ({ injectTypes }) => {
					// Inject the DTS File
					injectTypes({
						filename: 'core.d.ts',
						content: coreDtsFile,
					});
				},
			},
		};
	},
});
