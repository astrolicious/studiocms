import { defineIntegration } from 'astro-integration-kit';
import { passthroughImageService } from 'astro/config';
import { optionsSchema } from '../schemas';
import { cloudflareImageHandlerStrings } from '../strings';
import { studioLogger, studioLoggerOptsResolver } from '../utils';

export default defineIntegration({
	name: '@astrolicious/studioCMS:imageHandler/cloudflare',
	optionsSchema,
	setup({ options }) {
		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const { updateConfig, config } = params;

					const {
						imageService: { astroImageServiceConfig, cdnPlugin },
						verbose,
					} = options;

					const { logInfo } = await studioLoggerOptsResolver(params.logger, verbose);

					// Setup Image Service
					if (config.image?.service.entrypoint === '@astrojs/cloudflare/image-service') {
						studioLogger(logInfo, cloudflareImageHandlerStrings.CloudflareImageServiceEnabled);
					} else {
						studioLogger(logInfo, cloudflareImageHandlerStrings.CloudflareImageServiceDisabled);
						if (cdnPlugin === 'cloudinary-js') {
							if (astroImageServiceConfig === 'squoosh') {
								studioLogger(logInfo, cloudflareImageHandlerStrings.cdnPluginStrings.Squoosh);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								studioLogger(logInfo, cloudflareImageHandlerStrings.cdnPluginStrings.Sharp);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								studioLogger(logInfo, cloudflareImageHandlerStrings.cdnPluginStrings.NoOp);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							}
						} else {
							studioLogger(logInfo, cloudflareImageHandlerStrings.unpicStrings.disabled);
							if (astroImageServiceConfig === 'squoosh') {
								studioLogger(logInfo, cloudflareImageHandlerStrings.unsupported.Squoosh);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								studioLogger(logInfo, cloudflareImageHandlerStrings.unsupported.Sharp);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								studioLogger(logInfo, cloudflareImageHandlerStrings.NoOp);
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
