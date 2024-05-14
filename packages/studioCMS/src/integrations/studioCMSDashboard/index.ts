import { addDts, addIntegration, addVirtualImports, createResolver, defineIntegration } from "astro-integration-kit";
import { optionsSchema } from "../../schemas";
import { CheckENV, integrationLogger } from "../../utils";
import { loadEnv } from "vite";
import { fileFactory } from "../../utils/fileFactory";
import { DashboardStrings } from "../../strings";
import { presetTypography, presetWind, presetUno, transformerDirectives, presetIcons, presetWebFonts } from "unocss";
import UnoCSSAstroIntegration from "@unocss/astro";
import { presetDaisy } from "@yangyang20240403/unocss-preset-daisyui";
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import { type Input } from "@noble/hashes/utils";
import type { ScryptOpts } from "@noble/hashes/scrypt";
import * as fs from "fs";
import { randomUUID } from "node:crypto";

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

type usernameAndPasswordConfig = {
	salt: Input;
	opts: ScryptOpts;
}

export default defineIntegration({
    name: 'astrolicious/studioCMS:adminDashboard',
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
					 * 		"N": 2 ** 12, //NUMBER
					 * 		"r": 8, //NUMBER
					 * 		"p": 1, //NUMBER
					 * 		"dkLen": 32 //NUMBER
					 *   },
					 * }
					 */
					let VirtualAuthSecurity: usernameAndPasswordConfig

					if ( usernameAndPassword ) {
						try {
							const authConfigFileJson = fs.readFileSync(virtualResolver.StudioAuthConfig, { encoding: 'utf-8' });
							const authConfigFile: usernameAndPasswordConfig = JSON.parse(authConfigFileJson);
							let { salt, opts: { N = 2 ** 12, r = 8, p = 1, dkLen = 32 } } = authConfigFile;

							if ( !salt ) {
								// Make sure the salt is defined
								const newSalt = randomUUID();
								salt = newSalt;
							}

							VirtualAuthSecurity = { salt, opts: { N, r, p, dkLen }};
						} catch (error) {
							// Log that the file does not exist
							integrationLogger(logger, verbose, 'error', 'studiocms-auth.config.json file does not exist. Creating...');

							// Create a new salt
							const newSalt = randomUUID();
							VirtualAuthSecurity = { salt: newSalt, opts: { N: 2 ** 12, r: 8, p: 1, dkLen: 32 }};

							fs.writeFile(virtualResolver.StudioAuthConfig, JSON.stringify(VirtualAuthSecurity), (err) => {
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

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'studiocms-dashboard:auth': virtualComponentMap,
							'studiocms-dashboard:components': VirtualAstroComponents,
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
								presetScrollbar( ),
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
						}),
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
							pattern: makeRoute('new/post/'),
							entrypoint: resolve('./routes/dashboard/pages/new/post.astro')
						})
						injectRoute({
							pattern: makeRoute('new/page/'),
							entrypoint: resolve('./routes/dashboard/pages/new/page.astro')
						})
						injectRoute({
							pattern: makeRoute('post-list/'),
							entrypoint: resolve('./routes/dashboard/pages/post-list.astro')
						})
						injectRoute({
							pattern: makeRoute('page-list/'),
							entrypoint: resolve('./routes/dashboard/pages/page-list.astro')
						})
						injectRoute({
							pattern: makeRoute('edit/posts/[...slug]'),
							entrypoint: resolve('./routes/dashboard/pages/edit/posts/[...slug].astro')
						})
						injectRoute({
							pattern: makeRoute('delete/posts/[...slug]'),
							entrypoint: resolve('./routes/dashboard/pages/delete/posts/[...slug].astro')
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


                }
            }
        }
}});