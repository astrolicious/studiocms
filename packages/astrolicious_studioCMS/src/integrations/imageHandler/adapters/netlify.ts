import { imageService as unpicImageService } from '@unpic/astro/service';
import { defineIntegration } from 'astro-integration-kit';
import { passthroughImageService, sharpImageService, squooshImageService } from 'astro/config';
import { optionsSchema } from '../schemas';
import { netlifyImageHandlerStrings } from '../strings';
import { studioLogger, studioLoggerOptsResolver } from '../utils';

export default defineIntegration({
	name: '@astrolicious/studioCMS:imageHandler/netlify',
	optionsSchema,
	setup({ options }) {
		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const { updateConfig, config } = params;

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
					if (config.image?.service.entrypoint === '@astrojs/netlify/image-service.js') {
						studioLogger(logInfo, netlifyImageHandlerStrings.NetlifyImageServiceEnabled);
					} else {
						studioLogger(logInfo, netlifyImageHandlerStrings.NetlifyImageServiceDisabled);
						if (cdnPlugin === 'cloudinary-js') {
							if (astroImageServiceConfig === 'squoosh') {
								studioLogger(logInfo, netlifyImageHandlerStrings.cdnPluginStrings.Squoosh);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								studioLogger(logInfo, netlifyImageHandlerStrings.cdnPluginStrings.Sharp);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								studioLogger(logInfo, netlifyImageHandlerStrings.cdnPluginStrings.NoOp);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							}
						} else if (useUnpic && astroImageServiceConfig !== 'no-op') {
							studioLogger(logInfo, netlifyImageHandlerStrings.unpicStrings.default);
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
							studioLogger(logInfo, netlifyImageHandlerStrings.unpicStrings.NoOp);
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
							studioLogger(logInfo, netlifyImageHandlerStrings.unpicStrings.disabled);
							if (astroImageServiceConfig === 'squoosh') {
								studioLogger(logInfo, netlifyImageHandlerStrings.Squoosh);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								studioLogger(logInfo, netlifyImageHandlerStrings.Sharp);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								studioLogger(logInfo, netlifyImageHandlerStrings.NoOp);
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
