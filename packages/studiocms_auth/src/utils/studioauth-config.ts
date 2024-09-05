import { randomUUID } from 'node:crypto';
import { readFileSync, writeFile } from 'node:fs';
import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import type { StudioCMSOptions } from '@studiocms/core/schemas';
import { authConfigStrings } from '@studiocms/core/strings';
import type { AuthConfigMap, usernameAndPasswordConfig } from '@studiocms/core/types';
import { addVirtualImports, createResolver, defineUtility } from 'astro-integration-kit';

/**
 * Get the URL to the StudioCMS auth config file
 */
export function getStudioAuthConfigFileUrl(projectRootUrl: URL | string) {
	return new URL('./studiocms-auth.config.json', projectRootUrl);
}

// Username and Password Config
/**
 * Check if the salt is defined in the studiocms-auth.config.json file
 *
 * File is stored in the root of the user's project as studiocms-auth.config.json
 *
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt
 * @see https://words.filippo.io/the-scrypt-parameters/
 *
 * @example
 * {
 * 	"salt": "salt", //Uint8Array | string
 * 	"opts": {
 * 		"cpu_mem": 2 ** 12, //NUMBER
 * 		"block_size": 8, //NUMBER
 * 		"parallelization": 1, //NUMBER
 * 		"output_key_length": 32 //NUMBER
 *      "asyncTick": 10, //NUMBER
 * 		"max_mem": 1024 ** 3 + 1024 //NUMBER
 *   },
 * }
 */
export const usernameAndPasswordAuthConfig = defineUtility('astro:config:setup')(
	async (
		params,
		opts: {
			options: StudioCMSOptions;
			name: string;
		}
	) => {
		const { addWatchFile, config, logger } = params;
		const { name, options } = opts;

		const {
			dbStartPage,
			dashboardConfig: {
				dashboardEnabled,
				AuthConfig: { enabled: authEnabled },
			},
		} = options;

		const enabled = dashboardEnabled && authEnabled;

		if (dbStartPage || enabled) {
			integrationLogger(
				{ logger, logLevel: 'info', verbose: options.verbose },
				authConfigStrings.configSetup
			);

			// Watch the StudioCMS Auth Config File for changes (including creation/deletion)
			addWatchFile(getStudioAuthConfigFileUrl(config.root));

			const { resolve: AstroProjectRoot } = createResolver(config.root.pathname);

			let VirtualAuthSecurity: usernameAndPasswordConfig;

			const authFileOptsDefaults: AuthConfigMap['opts'] = {
				cpu_mem: 2 ** 12,
				block_size: 8,
				parallelization: 1,
				output_key_length: 32,
				asyncTick: 10,
				max_mem: 1024 ** 3 + 1024,
			};

			const userPassAuthConfigDefaults: usernameAndPasswordConfig['opts'] = {
				N: 2 ** 12,
				r: 8,
				p: 1,
				dkLen: 32,
				asyncTick: 10,
				maxmem: 1024 ** 3 + 1024,
			};

			// Resolve Options
			try {
				integrationLogger(
					{ logger, logLevel: 'info', verbose: options.verbose },
					authConfigStrings.readConfig
				);
				const authConfigFileJsonRAW = readFileSync(
					AstroProjectRoot('./studiocms-auth.config.json'),
					{ encoding: 'utf-8' }
				);

				const authConfigFileParsed: AuthConfigMap = JSON.parse(authConfigFileJsonRAW);

				if (!authConfigFileParsed.salt) {
					return integrationLogger(
						{ logger, logLevel: 'error', verbose: true },
						authConfigStrings.saltMissing
					);
				}

				const authConfigMap = {
					salt: authConfigFileParsed.salt,
					opts: {
						N: authConfigFileParsed.opts.cpu_mem || 2 ** 12,
						r: authConfigFileParsed.opts.block_size || 8,
						p: authConfigFileParsed.opts.parallelization || 1,
						dkLen: authConfigFileParsed.opts.output_key_length || 32,
						asyncTick: authConfigFileParsed.opts.asyncTick || 10,
						maxmem: authConfigFileParsed.opts.max_mem || 1024 ** 3 + 1024,
					},
				};

				VirtualAuthSecurity = authConfigMap;
			} catch (error) {
				integrationLogger(
					{ logger, logLevel: 'error', verbose: true },
					authConfigStrings.eRC.part1 + error + authConfigStrings.eRC.part2
				);

				const newSalt = randomUUID();
				VirtualAuthSecurity = { salt: newSalt, opts: userPassAuthConfigDefaults };

				const newAuthOutput: AuthConfigMap = {
					salt: newSalt,
					opts: authFileOptsDefaults,
				};

				const newAuthOutputString = JSON.stringify(newAuthOutput, null, 2);

				integrationLogger(
					{ logger, logLevel: 'info', verbose: options.verbose },
					authConfigStrings.newSalt
				);
				writeFile(
					AstroProjectRoot('./studiocms-auth.config.json'),
					newAuthOutputString,
					{ encoding: 'utf-8' },
					(err) => {
						if (err) {
							return integrationLogger(
								{ logger, logLevel: 'error', verbose: true },
								authConfigStrings.writeFileError + err
							);
						}
						return integrationLogger(
							{ logger, logLevel: 'info', verbose: options.verbose },
							authConfigStrings.newConfig + newSalt
						);
					}
				);
			}

			const VirtualAuthSecImport = `export default ${JSON.stringify(VirtualAuthSecurity)}`;

			addVirtualImports(params, {
				name,
				imports: {
					'studiocms:auth/config': VirtualAuthSecImport,
				},
			});

			integrationLogger(
				{ logger, logLevel: 'info', verbose: options.verbose },
				authConfigStrings.configComplete
			);
		}
	}
);
