import { addDts, addIntegration, addVirtualImports, createResolver, defineIntegration } from "astro-integration-kit";
import { optionsSchema } from "../../schemas";
import { CheckENV, integrationLogger } from "../../utils";
import { loadEnv } from "vite";
import { fileFactory } from "../../utils/fileFactory";
import { DashboardStrings, DbErrors } from "../../strings";
import { presetTypography, presetWind, presetUno, transformerDirectives, presetIcons, presetWebFonts } from "unocss";
import UnoCSSAstroIntegration from "@unocss/astro";
import { presetDaisy } from "@yangyang20240403/unocss-preset-daisyui";
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { presetScrollbar } from 'unocss-preset-scrollbar';
import * as fs from "node:fs";
import { randomUUID } from "node:crypto";
import type { AuthConfigMap, usernameAndPasswordConfig } from "../../schemas/auth-types";
import type { AstroIntegration } from "astro";

// Environment Variables
const env = loadEnv('all', process.cwd(), 'CMS');

const AUTHKEYS = {
	GITHUBCLIENTID: {
		N: 'CMS_GITHUB_CLIENT_ID',
		KEY:
			env.CMS_GITHUB_CLIENT_ID ||
			import.meta.env.CMS_GITHUB_CLIENT_ID ||
			process.env.CMS_GITHUB_CLIENT_ID,
	},
	GITHUBCLIENTSECRET: {
		N: 'CMS_GITHUB_CLIENT_SECRET',
		KEY:
			env.CMS_GITHUB_CLIENT_SECRET ||
			import.meta.env.CMS_GITHUB_CLIENT_SECRET ||
			process.env.CMS_GITHUB_CLIENT_SECRET,
	},
	DISCORDCLIENTID: {
		N: 'CMS_DISCORD_CLIENT_ID',
		KEY:
			env.CMS_DISCORD_CLIENT_ID ||
			import.meta.env.CMS_DISCORD_CLIENT_ID ||
			process.env.CMS_DISCORD_CLIENT_ID,
	},
	DISCORDCLIENTSECRET: {
		N: 'CMS_DISCORD_CLIENT_SECRET',
		KEY:
			env.CMS_DISCORD_CLIENT_SECRET ||
			import.meta.env.CMS_DISCORD_CLIENT_SECRET ||
			process.env.CMS_DISCORD_CLIENT_SECRET,
	},
	DISCORDREDIRECTURI: {
		N: 'CMS_DISCORD_REDIRECT_URL',
		KEY:
			env.CMS_DISCORD_REDIRECT_URI ||
			import.meta.env.CMS_DISCORD_REDIRECT_URI ||
			process.env.CMS_DISCORD_REDIRECT_URI,
	},
	GOOGLECLIENTID: {
		N: 'CMS_GOOGLE_CLIENT_ID',
		KEY:
			env.CMS_GOOGLE_CLIENT_ID ||
			import.meta.env.CMS_GOOGLE_CLIENT_ID ||
			process.env.CMS_GOOGLE_CLIENT_ID,
	},
	GOOGLECLIENTSECRET: {
		N: 'CMS_GOOGLE_CLIENT_SECRET',
		KEY:
			env.CMS_GOOGLE_CLIENT_SECRET ||
			import.meta.env.CMS_GOOGLE_CLIENT_SECRET ||
			process.env.CMS_GOOGLE_CLIENT_SECRET,
	},
	GOOGLEREDIRECTURI: {
		N: 'CMS_GOOGLE_REDIRECT_URL',
		KEY:
			env.CMS_GOOGLE_REDIRECT_URI ||
			import.meta.env.CMS_GOOGLE_REDIRECT_URI ||
			process.env.CMS_GOOGLE_REDIRECT_URI,
	},
	AUTH0CLIENTID: {
		N: 'CMS_AUTH0_CLIENT_ID',
		KEY:
			env.CMS_AUTH0_CLIENT_ID ||
			import.meta.env.CMS_AUTH0_CLIENT_ID ||
			process.env.CMS_AUTH0_CLIENT_ID,
	},
	AUTH0CLIENTSECRET: {
		N: 'CMS_AUTH0_CLIENT_SECRET',
		KEY:
			env.CMS_AUTH0_CLIENT_SECRET ||
			import.meta.env.CMS_AUTH0_CLIENT_SECRET ||
			process.env.CMS_AUTH0_CLIENT_SECRET,
	},
	AUTH0DOMAIN: {
		N: 'CMS_AUTH0_DOMAIN',
		KEY:
			env.CMS_AUTH0_DOMAIN ||
			import.meta.env.CMS_AUTH0_DOMAIN ||
			process.env.CMS_AUTH0_DOMAIN,
	},
	AUTH0REDIRECTURI: {
		N: 'CMS_AUTH0_REDIRECT_URL',
		KEY:
			env.CMS_AUTH0_REDIRECT_URI ||
			import.meta.env.CMS_AUTH0_REDIRECT_URI ||
			process.env.CMS_AUTH0_REDIRECT_URI,
	},
};

export default defineIntegration({
    name: '@astrolicious/studioCMS:adminDashboard',
    optionsSchema,
    setup({ name, options }) {
        return {
            hooks: {
                "astro:config:setup": async ( params ) => {

                    // Destructure the params and options
                    const { 
						logger, 
						config,
						addMiddleware,
						injectRoute,
					} = params;

                    const { 
						verbose, 
						dbStartPage,
						dashboardConfig: { 
							dashboardEnabled,
							AuthConfig,
							dashboardRouteOverride,
							UnoCSSConfigOverride: {
								injectEntry,
								injectReset,
								presetsConfig: {
									presetDaisyUI: {
										themes,
										darkTheme
									}
								},
							},
							AuthConfig: {
								providers: {
									usernameAndPasswordConfig: {
										allowUserRegistration
									},
									github,
									discord,
									google,
									auth0,
									usernameAndPassword
								}
							},
							developerConfig: {
								testingAndDemoMode
							},
						},
					} = options;

                    integrationLogger(logger, verbose, "info", "Dashboard Setup starting...");

                    // Check for Authenication Environment Variables
                    CheckENV(logger, verbose, AUTHKEYS);

					// Create Resolvers
					const { resolve } = createResolver(import.meta.url);
					const { resolve: rootResolve } = createResolver(config.root.pathname);

					// Virtual Resolver
					const virtualResolver = { 
						Auth: resolve('./lib/auth.ts'), 
						AuthENVChecker: resolve("./utils/authEnvCheck.ts"),
						DashboardLayout: resolve('./routes/dashboard/layouts/Layout.astro'),
						StudioAuthConfig: rootResolve('./studiocms-auth.config.json'),
						RouteMap: resolve('./utils/routemap.ts'),
					};

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
					let VirtualAuthSecurity: usernameAndPasswordConfig

					if ( usernameAndPassword ) {
						try {
							const authConfigFileJson = fs.readFileSync(virtualResolver.StudioAuthConfig, { encoding: 'utf-8' });
							const authConfigFile: AuthConfigMap = JSON.parse(authConfigFileJson);

							if (!authConfigFile.salt) {
								return integrationLogger(logger, true, 'error', 'studiocms-auth.config.json file does not contain a salt');
							}

							const authConfigMap = {
								salt: authConfigFile.salt,
								opts: {
									N: authConfigFile.opts.cpu_mem || 2 ** 12,
									r: authConfigFile.opts.block_size || 8,
									p: authConfigFile.opts.parallelization || 1,
									dkLen: authConfigFile.opts.output_key_length || 32,
									asyncTick: authConfigFile.opts.asyncTick || 10,
									maxmem: authConfigFile.opts.max_mem || 1024 ** 3 + 1024,
								}
							};


							VirtualAuthSecurity = authConfigMap;
						} catch (error) {
							// Log that the file does not exist
							integrationLogger(logger, verbose, 'error', 'studiocms-auth.config.json file does not exist. Creating...');

							// Create a new salt
							const newSalt = randomUUID();
							VirtualAuthSecurity = { salt: newSalt, opts: { N: 2 ** 12, r: 8, p: 1, dkLen: 32 }};

							const outputMap: AuthConfigMap = {
								salt: newSalt,
								opts: {
									cpu_mem: 2 ** 12,
									block_size: 8,
									parallelization: 1,
									output_key_length: 32,
									asyncTick: 10,
									max_mem: 1024 ** 3 + 1024,
								}
							}

							fs.writeFile(virtualResolver.StudioAuthConfig, JSON.stringify(outputMap, null, 2), (err) => {
								if (err) {
									// Log that the file could not be created
									integrationLogger(logger, verbose, 'error', 'studiocms-auth.config.json file could not be created');
								}
							});
						}

						// Create Virtual Config
						const VirtualAuthConfig = `export default ${JSON.stringify(VirtualAuthSecurity)}`;
						addVirtualImports(params, { name, imports: { 'virtual:studiocms-dashboard/auth-sec': VirtualAuthConfig } });

					}

					// Virtual Components
					const virtualComponentMap = `
					export * from '${virtualResolver.Auth}';
					export * from '${virtualResolver.AuthENVChecker}';`;

					const VirtualAstroComponents = `
					export {default as Layout} from '${virtualResolver.DashboardLayout}';`;

					const VirtualRouteMap = `
					export * from '${virtualResolver.RouteMap}';`;

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'studiocms-dashboard:auth': virtualComponentMap,
							'studiocms-dashboard:components': VirtualAstroComponents,
							'studiocms-dashboard:routeMap': VirtualRouteMap,
						},
					});

					// Create Virtual DTS File
					const studioCMSDTS = fileFactory();

					studioCMSDTS.addLines(`declare module 'studiocms-dashboard:auth' {
                        export const lucia: typeof import('${virtualResolver.Auth}').lucia;
						export const authEnvCheck: typeof import('${virtualResolver.AuthENVChecker}').authEnvCheck;
					}`);

					studioCMSDTS.addLines(`declare module 'studiocms-dashboard:components' {
						export const Layout: typeof import('${virtualResolver.DashboardLayout}').default;
					}`);

					studioCMSDTS.addLines(`declare module 'studiocms-dashboard:routeMap' {
						export const getSluggedRoute: typeof import('${virtualResolver.RouteMap}').getSluggedRoute;
						export const getEditRoute: typeof import('${virtualResolver.RouteMap}').getEditRoute;
						export const getDeleteRoute: typeof import('${virtualResolver.RouteMap}').getDeleteRoute;
						export const StudioCMSRoutes: typeof import('${virtualResolver.RouteMap}').StudioCMSRoutes;
						export type SideBarLink = import('${virtualResolver.RouteMap}').SideBarLink;
						export const sideBarLinkMap: import('${virtualResolver.RouteMap}').sideBarLinkMap;
					}`);

					// Add Virtual DTS File
					addDts(params, {
						name,
						content: studioCMSDTS.text(),
					});

					// Add Dashboard Integrations
					integrationLogger(logger, verbose, 'info', 'Adding Dashboard Integrations');

					// CSS Management
					addIntegration(params, {
						integration: UnoCSSAstroIntegration({
							configFile: false,
							injectReset: injectReset,
							injectEntry: injectEntry,
							presets: [
								presetUno(),
								presetWind(), 
								presetDaisy({
									themes: themes,
									darkTheme: darkTheme,
								}),
								presetTypography(),
								presetIcons({
									collections: {
										mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
										google: FileSystemIconLoader(resolve('./icons/google')),
										discord: FileSystemIconLoader(resolve('./icons/discord')),
										github: FileSystemIconLoader(resolve('./icons/github')),
										auth0: FileSystemIconLoader(resolve('./icons/auth0')),
									}
								}),
								presetScrollbar(),
								presetWebFonts({
									provider: 'google',
									fonts: {
										// Required Fonts for Google Icons
										  sans: 'Roboto',
										  mono: ['Fira Code', 'Fira Mono:400,700'],
									},
								}),
							],
							transformers: [
								transformerDirectives()
							],
						}) as unknown as AstroIntegration,
					});

					// In the case of First time Setup run the Start Pages
					if ( dbStartPage ) {
						injectRoute({
							pattern: 'start/',
							entrypoint: resolve('./routes/databaseSetup/main.astro'),
						});
						injectRoute({
							pattern: 'api/setup',
							entrypoint: resolve('./routes/databaseSetup/setup.ts'),
						});
						injectRoute({
							pattern: 'done/',
							entrypoint: resolve('./routes/databaseSetup/done.astro'),
						});
					}


					// Check if the Dashboard is enabled
					if ( dashboardEnabled && !dbStartPage ) {

						let defaultDashboardRoute = "dashboard";

						if (dashboardRouteOverride) {
							defaultDashboardRoute = dashboardRouteOverride.replace(/^\//, '');
						}

						const makeRoute = (path?: string) => {
							const output = `${defaultDashboardRoute}/${path}`;
							return output;
						}
						
						// Log that the Dashboard is enabled
						integrationLogger(logger, verbose, 'info', 'Dashboard is Enabled');

						// Add Dashboard API Routes
						injectRoute({
							pattern: makeRoute('api/liverender'),
							entrypoint: resolve('./routes/dashboard/partials/LivePreview.astro'),
						})
						
						// Setup the Dashboard Routes
						injectRoute({
							pattern: makeRoute("/"),
							entrypoint: resolve('./routes/dashboard/pages/index.astro')
						})
						injectRoute({
							pattern: makeRoute('profile/'),
							entrypoint: resolve('./routes/dashboard/pages/profile.astro')
						})
						injectRoute({
							pattern: makeRoute('configuration/'),
							entrypoint: resolve('./routes/dashboard/pages/configuration/index.astro')
						})
						injectRoute({
							pattern: makeRoute('configuration/admins/'),
							entrypoint: resolve('./routes/dashboard/pages/configuration/admins.astro')
						})
						injectRoute({
							pattern: makeRoute('new/page/'),
							entrypoint: resolve('./routes/dashboard/pages/new/page.astro')
						})
						injectRoute({
							pattern: makeRoute('page-list/'),
							entrypoint: resolve('./routes/dashboard/pages/edit/page-list.astro')
						})
						injectRoute({
							pattern: makeRoute('edit/pages/[...slug]'),
							entrypoint: resolve('./routes/dashboard/pages/edit/pages/[...slug].astro')
						})
						injectRoute({
							pattern: makeRoute('delete/pages/[...slug]'),
							entrypoint: resolve('./routes/dashboard/pages/delete/pages/[...slug].astro')
						})

						// Setup The Dashboard Authentication
						if ( AuthConfig.enabled ) {
							if ( testingAndDemoMode ) {
								// Log that the Auth is bypassed in Test and Demo Mode
								integrationLogger(logger, verbose, 'info', DashboardStrings.TestAndDemo);
							}

							// Log that the Auth is enabled
							integrationLogger(logger, verbose, 'info', 'Auth is Enabled');

							// Add Middleware for Auth Session Handling
							integrationLogger(logger, verbose, 'info', 'Adding Middleware');
							addMiddleware({
								entrypoint: resolve('./middleware/index.ts'),
								order: 'pre',
							});

							integrationLogger(logger, verbose, 'info', 'Adding Auth Routes');

							// Inject Login and Logout Routes
							injectRoute({
								pattern: makeRoute('login'),
								entrypoint: resolve('./routes/authroutes/login/index.astro'),
							})
							injectRoute({
								pattern: makeRoute('logout'),
								entrypoint: resolve('./routes/authroutes/logout.ts'),
							})

							// GitHub Auth Provider
							if ( github ) {
								// Log that the GitHub Auth Provider is enabled
								integrationLogger(logger, verbose, 'info', 'GitHub Auth Provider is Enabled');
								injectRoute({
									pattern: makeRoute('login/github'),
									entrypoint: resolve('./routes/authroutes/login/github/index.ts'),
								});
								injectRoute({
									pattern: makeRoute('login/github/callback'),
									entrypoint: resolve('./routes/authroutes/login/github/callback.ts'),
								});
							} else {
								// Log that the GitHub Auth Provider is disabled
								integrationLogger(logger, verbose, 'info', 'GitHub Auth Provider is Disabled');
							}

							// Discord Auth Provider
							if (discord){
								// Log that the Discord Auth Provider is enabled
								integrationLogger(logger, verbose, 'info', 'Discord Auth Provider is Enabled');
								injectRoute({
									pattern: makeRoute('login/discord'),
									entrypoint: resolve('./routes/authroutes/login/discord/index.ts'),
								});
								injectRoute({
									pattern: makeRoute('login/discord/callback'),
									entrypoint: resolve('./routes/authroutes/login/discord/callback.ts'),
								});
							}

							// Google Auth Provider
							if (google){
								// Log that the Google Auth Provider is enabled
								integrationLogger(logger, verbose, 'info', 'Google Auth Provider is Enabled');
								injectRoute({
									pattern: makeRoute('login/google'),
									entrypoint: resolve('./routes/authroutes/login/google/index.ts'),
								});
								injectRoute({
									pattern: makeRoute('login/google/callback'),
									entrypoint: resolve('./routes/authroutes/login/google/callback.ts'),
								});
							}

							// Auth0 Auth Provider
							if (auth0){
								// Log that the Auth0 Auth Provider is enabled
								integrationLogger(logger, verbose, 'info', 'Auth0 Auth Provider is Enabled');
								injectRoute({
									pattern: makeRoute('login/auth0'),
									entrypoint: resolve('./routes/authroutes/login/auth0/index.ts'),
								});
								injectRoute({
									pattern: makeRoute('login/auth0/callback'),
									entrypoint: resolve('./routes/authroutes/login/auth0/callback.ts'),
								});
							}

							// Username and Password Auth Provider
							if ( usernameAndPassword) {
								// Log that the Username and Password Auth Provider is enabled
								integrationLogger(logger, verbose, 'info', 'Username and Password Auth Provider is Enabled');
								injectRoute({
									pattern: makeRoute('login/api/login'),
									entrypoint: resolve('./routes/authroutes/login/api/login.ts'),
								})
								if ( allowUserRegistration ) {
									injectRoute({
										pattern: makeRoute('signup/'),
										entrypoint: resolve('./routes/authroutes/login/signup.astro'),
									})
									injectRoute({
										pattern: makeRoute('login/api/register'),
										entrypoint: resolve('./routes/authroutes/login/api/register.ts'),
									})
								}
							}

						} else if ( !AuthConfig.enabled ) {
							// Log that the Auth is disabled
							integrationLogger(logger, verbose, 'info', DashboardStrings.AuthDisabled);
						}

						// Log that the setup is complete
						integrationLogger(logger, verbose, "info", "Dashboard ready!");
						
					} else {
						// Log that the Dashboard is disabled
						integrationLogger(logger, verbose, 'info', DashboardStrings.DashboardDisabled);
					}


                },
				'astro:server:start': ({ logger }) => {
					// Display Console Message if dbStartPage(First Time DB Initialization) is enabled
					if (options.dbStartPage) {
						integrationLogger(
							logger,
							true,
							'warn',
							DbErrors.DbStartPage
						);
					}
				},
            }
        }
}});