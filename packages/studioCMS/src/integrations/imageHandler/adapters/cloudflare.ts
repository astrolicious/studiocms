import { defineIntegration } from 'astro-integration-kit';
import { passthroughImageService } from 'astro/config';
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
    name: 'astrolicious/studioCMS:imageHandler/cloudflare',
    optionsSchema: ImageHandlerOptionsSchema,
    setup({ options }) {
        return {
            hooks: {
                "astro:config:setup": ( params ) => {

					const {
						updateConfig,
						logger,
						config,
					} = params;

                    const { ImageServiceConfig: {
                        astroImageServiceConfig,
                        cdnPlugin,
                    }, verbose } = options;

						// Setup Image Service
						if (config.image?.service.entrypoint === '@astrojs/cloudflare/image-service') {
							integrationLogger(
								logger,
								verbose,
								'info',
								'Cloudflare Image Service Enabled. Using Cloudflare Image Service.'
							);
						} else {
							integrationLogger(
								logger,
								verbose,
								'info',
								'Cloudflare Image Service Disabled. Using Built-in Image Service.'
							);

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
										'warn',
										"Cloudflare SSR does not support Squoosh Image Service. Using no-op Service as astroImageServiceConfig is set to 'squoosh'"
									);
									updateConfig({
										image: { service: passthroughImageService() },
									});
								} else if (astroImageServiceConfig === 'sharp') {
									integrationLogger(
										logger,
										verbose,
										'warn',
										"Cloudflare SSR does not support Sharp Image Service. Using no-op Service as astroImageServiceConfig is set to 'sharp'"
									);
									updateConfig({
										image: { service: passthroughImageService() },
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
							} else {
								integrationLogger(
									logger,
									verbose,
									'info',
									'@unpic/astro Image Service Disabled, using Astro Built-in Image Service.'
								);
								if (astroImageServiceConfig === 'squoosh') {
									integrationLogger(
										logger,
										verbose,
										'info',
										"Cloudflare SSR does not support Squoosh Image Service. Using no-op Service as astroImageServiceConfig is set to 'squoosh'"
									);
									updateConfig({
										image: { service: passthroughImageService() },
									});
								} else if (astroImageServiceConfig === 'sharp') {
									integrationLogger(
										logger,
										verbose,
										'info',
										"Cloudflare SSR does not support Sharp Image Service. Using no-op Service as astroImageServiceConfig is set to 'sharp'"
									);
									updateConfig({
										image: { service: passthroughImageService() },
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
        }
    },
});