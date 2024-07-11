import { addIntegration, defineIntegration } from 'astro-integration-kit';
import { envField } from 'astro/config';
import { loadEnv } from 'vite';
import { studioLogger, studioLoggerOptsResolver } from './utils';
import { cloudflareImageHandler, netlifyImageHandler, nodeImageHandler, vercelImageHandler } from "./adapters"
import { optionsSchema } from './schemas';
import { imageHandlerStrings } from './strings';
import { componentResolver } from './componentResolver';
import { addAstroEnvConfig } from '../../utils/astroEnvConfig';

export default defineIntegration({
    name: '@astrolicious/studioCMS:imageHandler',
    optionsSchema,
    setup({ name, options }) {
		const env = loadEnv('all', process.cwd(), 'CMS');
        return {
            hooks: {
                "astro:config:setup": async ( params ) => {

					const { config: { adapter } } = params;

                    const { verbose, imageService: { cdnPlugin } } = options;

					const LoggerOpts = await studioLoggerOptsResolver(params.logger, verbose);

					const currentAdapters = [
						'@astrojs/node', 
						'@astrojs/cloudflare', 
						'@astrojs/vercel', 
						'@astrojs/netlify'
					];

					addAstroEnvConfig(params,{
						schema: {
							CMS_CLOUDINARY_CLOUDNAME: envField.string({
								context: 'server',
								access: 'secret',
								optional: true,
							})
						}
					});

					if (cdnPlugin === 'cloudinary-js') {
						if (!env.CMS_CLOUDINARY_CLOUDNAME) {
							studioLogger(LoggerOpts.logWarn, imageHandlerStrings.CloudinaryCDNWarning);
						}
					}

					// Setup and Configure CustomImage Component
					studioLogger(LoggerOpts.logInfo, imageHandlerStrings.CustomImageLog);
					componentResolver(params, { name, CustomImageOverride: options.overrides.CustomImageOverride})

                    // Setup and Configure Astro Adapters and Image Services based on the Adapter and Image Service Configurations
					studioLogger(LoggerOpts.logInfo, `Determining Astro Adapter Configuration... ${adapter && (`Detected Adapter: ${adapter.name}`)}`);

					// Check for Astro Adapter

					// Node Adapter
					if (adapter?.name === '@astrojs/node') {
						studioLogger(LoggerOpts.logInfo, imageHandlerStrings.NodeAdapter);
						addIntegration(params, {integration: nodeImageHandler(options) })
					} else 

					// Cloudflare Adapter
					if (adapter?.name === '@astrojs/cloudflare') {
						studioLogger(LoggerOpts.logInfo, imageHandlerStrings.CloudflareAdapter);
						addIntegration(params, {integration: cloudflareImageHandler(options) })
					} else

					// Vercel Adapter
					if (adapter?.name === '@astrojs/vercel') {
						studioLogger(LoggerOpts.logInfo, imageHandlerStrings.VercelAdapter);
						addIntegration(params, {integration: vercelImageHandler(options) })
					} else

					// Netlify Adapter
					if (adapter?.name === '@astrojs/netlify') {
						studioLogger(LoggerOpts.logInfo, imageHandlerStrings.NetlifyAdapter);
						addIntegration(params, {integration: netlifyImageHandler(options) })
					} else
					
					// Unknown Adapter
					if (adapter?.name !== undefined && !currentAdapters.includes(adapter.name)) {
						studioLogger(LoggerOpts.logWarn, imageHandlerStrings.UnknownAdapter.part1+adapter.name+imageHandlerStrings.UnknownAdapter.part2);
					} else 
					
					// No Adapter Detected
					if (adapter?.name === undefined) {
						studioLogger(LoggerOpts.logWarn, imageHandlerStrings.NoAdapter);
					}

                }
            }
        }
    },
});