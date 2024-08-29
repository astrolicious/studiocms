import { addIntegration, defineIntegration } from 'astro-integration-kit';
import { envField } from 'astro/config';
import { loadEnv } from 'vite';
import { addAstroEnvConfig } from '../../utils/astroEnvConfig';
import {
	cloudflareImageHandler,
	netlifyImageHandler,
	nodeImageHandler,
	vercelImageHandler,
} from './adapters';
import { componentResolver } from './componentResolver';
import { optionsSchema } from './schemas';
import { imageHandlerStrings } from './strings';
import { studioLogger, studioLoggerOptsResolver } from './utils';

export default defineIntegration({
	name: '@astrolicious/studioCMS:imageHandler',
	optionsSchema,
	setup({ name, options }) {
		const env = loadEnv('all', process.cwd(), 'CMS');

		let dtsFile: string;

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const {
						config: { adapter },
					} = params;

					const {
						verbose,
						imageService: { cdnPlugin },
					} = options;

					const LoggerOpts = await studioLoggerOptsResolver(params.logger, verbose);

					const currentAdapters = [
						'@astrojs/node',
						'@astrojs/cloudflare',
						'@astrojs/vercel',
						'@astrojs/netlify',
					];

					addAstroEnvConfig(params, {
						validateSecrets: false,
						schema: {
							CMS_CLOUDINARY_CLOUDNAME: envField.string({
								context: 'server',
								access: 'secret',
								optional: true,
							}),
						},
					});

					if (cdnPlugin === 'cloudinary-js') {
						if (!env.CMS_CLOUDINARY_CLOUDNAME) {
							studioLogger(LoggerOpts.logWarn, imageHandlerStrings.CloudinaryCDNWarning);
						}
					}

					// Setup and Configure CustomImage Component
					studioLogger(LoggerOpts.logInfo, imageHandlerStrings.CustomImageLog);
					const { imageHandlerDtsFile } = componentResolver(params, {
						name,
						CustomImageOverride: options.overrides.CustomImageOverride,
					});

					// Return the Custom Image DTS File
					dtsFile = imageHandlerDtsFile;

					// Setup and Configure Astro Adapters and Image Services based on the Adapter and Image Service Configurations
					studioLogger(
						LoggerOpts.logInfo,
						`Determining Astro Adapter Configuration... ${adapter && `Detected Adapter: ${adapter.name}`}`
					);

					// Check for Astro Adapter

					// Node Adapter
					if (adapter?.name === '@astrojs/node') {
						studioLogger(LoggerOpts.logInfo, imageHandlerStrings.NodeAdapter);
						addIntegration(params, { integration: nodeImageHandler(options) });
					}

					// Cloudflare Adapter
					else if (adapter?.name === '@astrojs/cloudflare') {
						studioLogger(LoggerOpts.logInfo, imageHandlerStrings.CloudflareAdapter);
						addIntegration(params, { integration: cloudflareImageHandler(options) });
					}

					// Vercel Adapter
					else if (adapter?.name === '@astrojs/vercel') {
						studioLogger(LoggerOpts.logInfo, imageHandlerStrings.VercelAdapter);
						addIntegration(params, { integration: vercelImageHandler(options) });
					}

					// Netlify Adapter
					else if (adapter?.name === '@astrojs/netlify') {
						studioLogger(LoggerOpts.logInfo, imageHandlerStrings.NetlifyAdapter);
						addIntegration(params, { integration: netlifyImageHandler(options) });
					}

					// Unknown Adapter
					else if (adapter?.name !== undefined && !currentAdapters.includes(adapter.name)) {
						studioLogger(
							LoggerOpts.logWarn,
							imageHandlerStrings.UnknownAdapter.part1 +
								adapter.name +
								imageHandlerStrings.UnknownAdapter.part2
						);
					}

					// No Adapter Detected
					else if (adapter?.name === undefined) {
						studioLogger(LoggerOpts.logWarn, imageHandlerStrings.NoAdapter);
					}
				},
				'astro:config:done': ({ injectTypes }) => {
					injectTypes({
						filename: 'imageHandler.d.ts',
						content: dtsFile,
					});
				},
			},
		};
	},
});
