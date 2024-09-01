import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { StudioCMSOptionsSchema as optionsSchema } from '@studiocms/core/schemas';
import { netlifyImageHandlerStrings } from '@studiocms/core/strings';
import { imageService as unpicImageService } from '@unpic/astro/service';
import { defineIntegration } from 'astro-integration-kit';
import { passthroughImageService, sharpImageService, squooshImageService } from 'astro/config';
import { name as packageName } from '../../package.json';

export default defineIntegration({
	name: `${packageName}:netlify`,
	optionsSchema,
	setup({ options }) {
		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const { updateConfig, config, logger } = params;

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
					if (config.image?.service.entrypoint === '@astrojs/netlify/image-service.js') {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							netlifyImageHandlerStrings.NetlifyImageServiceEnabled
						);
					} else {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							netlifyImageHandlerStrings.NetlifyImageServiceDisabled
						);
						if (cdnPlugin === 'cloudinary-js') {
							if (astroImageServiceConfig === 'squoosh') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									netlifyImageHandlerStrings.cdnPluginStrings.Squoosh
								);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									netlifyImageHandlerStrings.cdnPluginStrings.Sharp
								);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									netlifyImageHandlerStrings.cdnPluginStrings.NoOp
								);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							}
						} else if (useUnpic && astroImageServiceConfig !== 'no-op') {
							integrationLogger(
								{ logger, logLevel: 'info', verbose },
								netlifyImageHandlerStrings.unpicStrings.default
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
								netlifyImageHandlerStrings.unpicStrings.NoOp
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
								netlifyImageHandlerStrings.unpicStrings.disabled
							);
							if (astroImageServiceConfig === 'squoosh') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									netlifyImageHandlerStrings.Squoosh
								);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									netlifyImageHandlerStrings.Sharp
								);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								integrationLogger(
									{ logger, logLevel: 'info', verbose },
									netlifyImageHandlerStrings.NoOp
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
