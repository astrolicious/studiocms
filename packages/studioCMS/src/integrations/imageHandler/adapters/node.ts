import { defineIntegration } from 'astro-integration-kit';
import { imageService as unpicImageService } from '@unpic/astro/service';
import { passthroughImageService, sharpImageService, squooshImageService } from 'astro/config';
import { integrationLogger } from '../../../utils';
import { AstroError } from 'astro/errors';
import { loadEnv } from 'vite';
import { ImageHandlerOptionsSchema } from '../schemas';

// Environment Variables
const env = loadEnv('all', process.cwd(), 'CMS');

const AUTHKEYS = {
	CLOUDINARY: {
		N: 'CMS_CLOUDINARY_CLOUDNAME',
		KEY:
			env.CMS_CLOUDINARY_CLOUDNAME ||
			import.meta.env.CMS_CLOUDINARY_CLOUDNAME ||
			process.env.CMS_CLOUDINARY_CLOUDNAME,
	},
};

export default defineIntegration({
    name: 'astrolicious/studioCMS:imageHandler/node',
    optionsSchema: ImageHandlerOptionsSchema,
    setup({ options }) {
        return {
            hooks: {
                "astro:config:setup": ( params ) => {

					const {
						updateConfig,
						logger,
					} = params;

                    const { ImageServiceConfig: {
                        useUnpic,
                        astroImageServiceConfig,
                        cdnPlugin,
                        unpicConfig: {
                            cdnOptions,
                            layout,
                            placeholder,
                            fallbackService,
                        }
                    }, verbose } = options;

						// Setup Image Service
						if (cdnPlugin === 'cloudinary-js') {
							if (!AUTHKEYS.CLOUDINARY.KEY) {
								throw new AstroError(
									`Using the Cloudinary CDN JS SDK Plugin requires the ${AUTHKEYS.CLOUDINARY.N} environment variable to be set. Please add this to your .env file.`
								);
							}
							if (astroImageServiceConfig === 'squoosh') {
								integrationLogger(
									logger,
									verbose,
									'info',
									'Using Squoosh Image Service as Fallback for Cloudinary CDN Plugin'
								);
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								integrationLogger(
									logger,
									verbose,
									'info',
									'Using Sharp Image Service as Fallback for Cloudinary CDN Plugin'
								);
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								integrationLogger(
									logger,
									verbose,
									'info',
									'Using No-Op Image Service as Fallback for Cloudinary CDN Plugin'
								);
								updateConfig({
									image: { service: passthroughImageService() },
								});
							}
						} else if (useUnpic && astroImageServiceConfig !== 'no-op') {
							integrationLogger(
								logger,
								verbose,
								'info',
								'Loading @unpic/astro Image Service for External Images'
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
								logger,
								verbose,
								'info',
								'Loading @unpic/astro Image Service for External Images'
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
								logger,
								verbose,
								'info',
								'@unpic/astro Image Service Disabled, using Astro Built-in Image Service.'
							);
							if (astroImageServiceConfig === 'squoosh') {
								integrationLogger(logger, verbose, 'info', 'Using Squoosh Image Service');
								updateConfig({
									image: { service: squooshImageService() },
								});
							} else if (astroImageServiceConfig === 'sharp') {
								integrationLogger(logger, verbose, 'info', 'Using Sharp Image Service');
								updateConfig({
									image: { service: sharpImageService() },
								});
							} else if (astroImageServiceConfig === 'no-op') {
								integrationLogger(logger, verbose, 'info', 'Using No-Op Image Service');
								updateConfig({
									image: { service: passthroughImageService() },
								});
							}
						}
                }
            }
        }
    },
});