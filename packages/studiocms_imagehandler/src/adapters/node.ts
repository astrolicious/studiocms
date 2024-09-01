import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { nodeImageHandlerStrings, StudioCMSOptionsSchema as optionsSchema } from '@studiocms/core';
import { imageService as unpicImageService } from '@unpic/astro/service';
import { defineIntegration } from 'astro-integration-kit';
import { passthroughImageService, sharpImageService, squooshImageService } from 'astro/config';
import { name as packageName } from '../../package.json';

export default defineIntegration({
	name: `${packageName}:node`,
	optionsSchema,
	setup({ options }) {
		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const { updateConfig, logger } = params;

					const {
						imageService: {
							useUnpic,
							astroImageServiceConfig,
							cdnPlugin,
							unpicConfig: { cdnOptions, layout, placeholder, fallbackService },
						},
						verbose,
					} = options;

					// Setup Image Service
					if (cdnPlugin === 'cloudinary-js') {
						if (astroImageServiceConfig === 'squoosh') {
							integrationLogger(
								{ logger, logLevel: 'info', verbose },
								nodeImageHandlerStrings.cdnPluginStrings.Squoosh
							);
							updateConfig({
								image: { service: squooshImageService() },
							});
						} else if (astroImageServiceConfig === 'sharp') {
							integrationLogger(
								{ logger, logLevel: 'info', verbose },
								nodeImageHandlerStrings.cdnPluginStrings.Sharp
							);
							updateConfig({
								image: { service: sharpImageService() },
							});
						} else if (astroImageServiceConfig === 'no-op') {
							integrationLogger(
								{ logger, logLevel: 'info', verbose },
								nodeImageHandlerStrings.cdnPluginStrings.NoOp
							);
							updateConfig({
								image: { service: passthroughImageService() },
							});
						}
					} else if (useUnpic && astroImageServiceConfig !== 'no-op') {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							nodeImageHandlerStrings.unpicStrings.default
						);
						updateConfig({
							image: {
								service: unpicImageService({
									placeholder: placeholder,
									fallbackService: fallbackService ? fallbackService : astroImageServiceConfig,
									layout: layout,
									cdnOptions: cdnOptions,
								}),
							},
						});
					} else if (useUnpic && astroImageServiceConfig === 'no-op') {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							nodeImageHandlerStrings.unpicStrings.NoOp
						);
						updateConfig({
							image: {
								service: unpicImageService({
									placeholder: placeholder,
									fallbackService: fallbackService ? fallbackService : 'astro',
									layout: layout,
									cdnOptions: cdnOptions,
								}),
							},
						});
					} else {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							nodeImageHandlerStrings.unpicStrings.disabled
						);
						if (astroImageServiceConfig === 'squoosh') {
							integrationLogger(
								{ logger, logLevel: 'info', verbose },
								nodeImageHandlerStrings.Squoosh
							);
							updateConfig({
								image: { service: squooshImageService() },
							});
						} else if (astroImageServiceConfig === 'sharp') {
							integrationLogger(
								{ logger, logLevel: 'info', verbose },
								nodeImageHandlerStrings.Sharp
							);
							updateConfig({
								image: { service: sharpImageService() },
							});
						} else if (astroImageServiceConfig === 'no-op') {
							integrationLogger(
								{ logger, logLevel: 'info', verbose },
								nodeImageHandlerStrings.NoOp
							);
							updateConfig({
								image: { service: passthroughImageService() },
							});
						}
					}
				},
			},
		};
	},
});
