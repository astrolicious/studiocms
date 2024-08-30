import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import {
	StudioCMSOptionsSchema as optionsSchema,
	vercelImageHandlerStrings,
} from '@studiocms/core';
import { imageService as unpicImageService } from '@unpic/astro/service';
import { defineIntegration } from 'astro-integration-kit';
import { passthroughImageService, sharpImageService, squooshImageService } from 'astro/config';

export default defineIntegration({
	name: '@studioCMS/imagehandler:vercel',
	optionsSchema,
	setup({ options }) {
		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const { updateConfig, command, config, logger } = params;

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
					if (
						command === 'build' &&
						config.image.service.entrypoint === '@astrojs/vercel/build-image-service'
					) {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							vercelImageHandlerStrings.VercelBuildImageServerEnabled
						);
					} else {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							vercelImageHandlerStrings.VercelBuildImageServerDisabled
						);
						if (cdnPlugin === 'cloudinary-js') {
							if (astroImageServiceConfig === 'squoosh') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									vercelImageHandlerStrings.cdnPluginStrings.Squoosh
								);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									vercelImageHandlerStrings.cdnPluginStrings.Sharp
								);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									vercelImageHandlerStrings.cdnPluginStrings.NoOp
								);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							}
						} else if (useUnpic && astroImageServiceConfig !== 'no-op') {
							integrationLogger(
								{ logger, logLevel: 'info', verbose },
								vercelImageHandlerStrings.unpicStrings.default
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
								vercelImageHandlerStrings.unpicStrings.NoOp
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
								vercelImageHandlerStrings.unpicStrings.disabled
							);
							if (astroImageServiceConfig === 'squoosh') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									vercelImageHandlerStrings.Squoosh
								);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									vercelImageHandlerStrings.Sharp
								);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									vercelImageHandlerStrings.NoOp
								);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							}
						}
					}
				},
			},
		};
	},
});
