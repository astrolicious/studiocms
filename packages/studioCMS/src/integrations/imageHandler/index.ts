import { addIntegration, defineIntegration } from 'astro-integration-kit';
import { integrationLogger } from '../../utils';
import nodeImageHandler from './adapters/node';
import cloudflareImageHandler from './adapters/cloudflare';
import vercelImageHandler from './adapters/vercel';
import netlifyImageHandler from './adapters/netlify';
import { ImageHandlerOptionsSchema } from './schemas';

export default defineIntegration({
    name: '@astrolicious/studioCMS:imageHandler',
    optionsSchema: ImageHandlerOptionsSchema,
    setup({ options }) {
        return {
            hooks: {
                "astro:config:setup": ( params ) => {

					const {
						logger,
						config: { adapter },
					} = params;

                    const { verbose } = options;

					const currentAdapters = [
						'@astrojs/node', 
						'@astrojs/cloudflare', 
						'@astrojs/vercel', 
						'@astrojs/netlify'
					];

                    // Setup and Configure Astro Adapters and Image Services based on the Adapter and Image Service Configurations
					integrationLogger(logger, verbose, 'info', 'Determining Astro Adapter Configuration');

					// Check for Astro Adapter

					// Node Adapter
					if (adapter?.name === '@astrojs/node') {
						integrationLogger(logger, verbose, 'info', 'Node Adapter Detected. Using Node Adapter.');
						addIntegration(params, {integration: nodeImageHandler(options) })
					} else 

					// Cloudflare Adapter
					if (adapter?.name === '@astrojs/cloudflare') {
						integrationLogger(logger, verbose, 'info', 'Cloudflare Adapter Detected. Using Cloudflare Adapter.');
						addIntegration(params, {integration: cloudflareImageHandler(options) })
					} else

					// Vercel Adapter
					if (adapter?.name === '@astrojs/vercel') {
						integrationLogger(logger, verbose, 'info', 'Vercel Adapter Detected. Using Vercel Adapter.');
						addIntegration(params, {integration: vercelImageHandler(options) })
					} else

					// Netlify Adapter
					if (adapter?.name === '@astrojs/netlify') {
						integrationLogger(logger, verbose, 'info', 'Netlify Adapter Detected. Using Netlify Adapter.');
						addIntegration(params, {integration: netlifyImageHandler(options) })
					} else
					
					// Unknown Adapter
					if (adapter?.name !== undefined && !currentAdapters.includes(adapter.name)) {
						integrationLogger(logger, verbose, 'warn', `Unknown Adapter Detected: ${adapter.name}. studioCMS Image Handler has not been configured for this adapter. Please open an issue on the studioCMS GitHub Repository. https://github.com/astrolicious/studioCMS/issues`);
					} else 
					
					// No Adapter Detected
					if (adapter?.name === undefined) {
						integrationLogger(logger, verbose, 'warn', 'No Adapter Detected.  studioCMS Image Handler will only be configured with SSR Adapters!');
					}

                }
            }
        }
    },
});