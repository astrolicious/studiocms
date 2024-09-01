import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { createResolver, defineIntegration } from 'astro-integration-kit';
import { version } from '../package.json';
import { name } from '../package.json';
import { StudioCMSOptionsSchema as optionsSchema } from './schemas';
import { CoreStrings } from './strings';
import { coreVirtualModuleGeneration } from './utils/coreVirtualModules';

export default defineIntegration({
	name,
	optionsSchema,
	setup({ name, options }) {
		// Declaration for Core DTS File
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

					// Destruction Options
					const { verbose } = options;

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
