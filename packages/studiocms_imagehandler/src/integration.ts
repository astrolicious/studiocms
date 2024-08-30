import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { addAstroEnvConfig } from '@studiocms/core';
import { imageHandlerStrings, StudioCMSOptionsSchema as optionsSchema } from '@studiocms/core';
import { addIntegration, defineIntegration } from 'astro-integration-kit';
import { envField } from 'astro/config';
import { loadEnv } from 'vite';
import {
	cloudflareImageHandler,
	netlifyImageHandler,
	nodeImageHandler,
	vercelImageHandler,
} from './adapters';
import { componentResolver } from './componentResolver';

export default defineIntegration({
	name: '@studioCMS/imagehandler',
	optionsSchema,
	setup({ name, options }) {
		const env = loadEnv('all', process.cwd(), 'CMS');

		let dtsFile: string;

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const {
						config: { adapter },
						logger,
					} = params;

					const {
						verbose,
						imageService: { cdnPlugin },
					} = options;

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
							integrationLogger(
								{ logger, logLevel: 'warn', verbose: true },
								imageHandlerStrings.CloudinaryCDNWarning
							);
						}
					}

					// Setup and Configure CustomImage Component
					integrationLogger(
						{ logger, logLevel: 'info', verbose },
						imageHandlerStrings.CustomImageLog
					);
					const { imageHandlerDtsFile } = componentResolver(params, {
						name,
						CustomImageOverride: options.overrides.CustomImageOverride,
					});

					// Return the Custom Image DTS File
					dtsFile = imageHandlerDtsFile;

					// Setup and Configure Astro Adapters and Image Services based on the Adapter and Image Service Configurations
					integrationLogger(
						{ logger, logLevel: 'info', verbose },
						`Determining Astro Adapter Configuration... ${adapter && `Detected Adapter: ${adapter.name}`}`
					);

					// Check for Astro Adapter

					// Node Adapter
					if (adapter?.name === '@astrojs/node') {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							imageHandlerStrings.NodeAdapter
						);
						addIntegration(params, { integration: nodeImageHandler(options) });
					}

					// Cloudflare Adapter
					else if (adapter?.name === '@astrojs/cloudflare') {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							imageHandlerStrings.CloudflareAdapter
						);
						addIntegration(params, { integration: cloudflareImageHandler(options) });
					}

					// Vercel Adapter
					else if (adapter?.name === '@astrojs/vercel') {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							imageHandlerStrings.VercelAdapter
						);
						addIntegration(params, { integration: vercelImageHandler(options) });
					}

					// Netlify Adapter
					else if (adapter?.name === '@astrojs/netlify') {
						integrationLogger(
							{ logger, logLevel: 'info', verbose },
							imageHandlerStrings.NetlifyAdapter
						);
						addIntegration(params, { integration: netlifyImageHandler(options) });
					}

					// Unknown Adapter
					else if (adapter?.name !== undefined && !currentAdapters.includes(adapter.name)) {
						integrationLogger(
							{ logger, logLevel: 'warn', verbose: true },
							imageHandlerStrings.UnknownAdapter.part1 +
								adapter.name +
								imageHandlerStrings.UnknownAdapter.part2
						);
					}

					// No Adapter Detected
					else if (adapter?.name === undefined) {
						integrationLogger(
							{ logger, logLevel: 'warn', verbose: true },
							imageHandlerStrings.NoAdapter
						);
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
