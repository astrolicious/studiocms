import { imageService as unpicImageService } from '@unpic/astro/service';
import { defineIntegration } from 'astro-integration-kit';
import { passthroughImageService, sharpImageService, squooshImageService } from 'astro/config';
import { optionsSchema } from '../schemas';
import { vercelImageHandlerStrings } from '../strings';
import { studioLogger, studioLoggerOptsResolver } from '../utils';

export default defineIntegration({
	name: '@astrolicious/studioCMS:imageHandler/vercel',
	optionsSchema,
	setup({ options }) {
		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const { updateConfig, command, config } = params;

					const {
						imageService: {
							useUnpic,
							astroImageServiceConfig,
							cdnPlugin,
							unpicConfig: { cdnOptions, layout, placeholder, fallbackService },
						},
						verbose,
					} = options;

					const { logInfo } = await studioLoggerOptsResolver(params.logger, verbose);

					// Setup Image Service
					if (
						command === 'build' &&
						config.image.service.entrypoint === '@astrojs/vercel/build-image-service'
					) {
						studioLogger(logInfo, vercelImageHandlerStrings.VercelBuildImageServerEnabled);
					} else {
						studioLogger(logInfo, vercelImageHandlerStrings.VercelBuildImageServerDisabled);
						if (cdnPlugin === 'cloudinary-js') {
							if (astroImageServiceConfig === 'squoosh') {
								studioLogger(logInfo, vercelImageHandlerStrings.cdnPluginStrings.Squoosh);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								studioLogger(logInfo, vercelImageHandlerStrings.cdnPluginStrings.Sharp);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								studioLogger(logInfo, vercelImageHandlerStrings.cdnPluginStrings.NoOp);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							}
						} else if (useUnpic && astroImageServiceConfig !== 'no-op') {
							studioLogger(logInfo, vercelImageHandlerStrings.unpicStrings.default);
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
							studioLogger(logInfo, vercelImageHandlerStrings.unpicStrings.NoOp);
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
							studioLogger(logInfo, vercelImageHandlerStrings.unpicStrings.disabled);
							if (astroImageServiceConfig === 'squoosh') {
								studioLogger(logInfo, vercelImageHandlerStrings.Squoosh);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								studioLogger(logInfo, vercelImageHandlerStrings.Sharp);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								studioLogger(logInfo, vercelImageHandlerStrings.NoOp);
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
