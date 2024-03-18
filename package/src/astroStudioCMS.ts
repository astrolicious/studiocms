import { imageService } from "@unpic/astro/service";
import { AstroError } from "astro/errors";
import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { loadEnv } from "vite";
import { optionsSchema } from "./schemas";
import { integrationLogger } from "./utils";
import dbInject from "./db/integration";
import fs from "node:fs"

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = loadEnv( "all", process.cwd(), "GITHUB");

// This is the primary user-facing integration that will be used to install the Astro Studio CMS
/**
 * Astro Studio CMS Integration - Experimental
 */
export default defineIntegration({
    name: "astro-studio-cms",
    optionsSchema,
    plugins: [...corePlugins],
    setup({ options }) {
        // Check for Verbose Mode
        const isVerbose = options.verbose;

        return {
            "astro:config:setup": ({ 
                watchIntegration, 
                addMiddleware, 
                addIntegration,
                addVirtualImports,
                updateConfig,
                config,
                logger,
                injectRoute,
            }) => {

                // Create Resolver for Virtual Imports
                const { resolve } = createResolver(import.meta.url);
                const { resolve: rootResolve } = createResolver(config.root.pathname)
                
                // Check for SSR Mode
                if (config.output !== "server" ) {
                    throw new AstroError("Astro Studio CMS is only supported in 'Output: server' SSR mode.");
                }

                // Check for Site URL
                if (!config.site) {
                    throw new AstroError("Astro Studio CMS requires a 'site' configuration in your Astro Config.");
                }

                // Watch Integration for changes
                watchIntegration(resolve());

                // Check for Required Environment Variables
                if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
                    throw new AstroError("GitHub OAuth Client ID and Secret are required to use Astro Studio CMS.");
                }

                // Add Virtual Imports
                integrationLogger(
                    logger, isVerbose, 
                    "info", 
                    "Adding Virtual Imports..."
                );
                addVirtualImports({
                    'virtual:astro-studio-cms:config': `export default ${JSON.stringify(options) };`,
                })

                // Add Authentication Middleware if not disabled
                if (!options.disableAuth) {
                    integrationLogger(
                        logger, isVerbose, 
                        "info", 
                        "Authentication Middleware Enabled"
                    );
                    addMiddleware({
                        entrypoint: resolve('./middleware/index.ts'),
                        order: "post",
                    });
                } else {
                    // Log that Authentication Middleware is Disabled
                    integrationLogger(
                        logger, isVerbose, 
                        "info", 
                        "Authentication Middleware Disabled"
                    );
                }

                // Add Page Routes
                integrationLogger(
                    logger, isVerbose, 
                    "info", 
                    "Adding Page Routes..."
                );
                injectRoute({ 
                    pattern: config.base, 
                    entrypoint: resolve('./pages/index.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}about/`, 
                    entrypoint: resolve('./pages/about.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}blog/`, 
                    entrypoint: resolve('./pages/blog/index.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}blog/[slug]`, 
                    entrypoint: resolve('./pages/blog/[...slug].astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/`, 
                    entrypoint: resolve('./pages/dashboard/index.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/profile`, 
                    entrypoint: resolve('./pages/dashboard/profile.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/new-post`, 
                    entrypoint: resolve('./pages/dashboard/new-post.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/login`, 
                    entrypoint: resolve('./pages/dashboard/login/index.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/edit/home`, 
                    entrypoint: resolve('./pages/dashboard/edit/home.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/edit/about`, 
                    entrypoint: resolve('./pages/dashboard/edit/about.astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/edit/[...slug]`, 
                    entrypoint: resolve('./pages/dashboard/edit/[...slug].astro'), 
                });
                injectRoute({ 
                    pattern: `${config.base}rss.xml`, 
                    entrypoint: resolve('./pages/rss.xml.ts'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/login/github`, 
                    entrypoint: resolve('./pages/dashboard/login/github/index.ts'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/login/github/callback`, 
                    entrypoint: resolve('./pages/dashboard/login/github/callback.ts'), 
                });
                injectRoute({ 
                    pattern: `${config.base}dashboard/logout`, 
                    entrypoint: resolve('./pages/dashboard/logout.ts'), 
                });

                // Add Database Integration
                integrationLogger(
                    logger, isVerbose, 
                    "info", 
                    "Loading Custom AstroDB configuration..."
                );
                addIntegration(dbInject())

                // Update Astro Config
                integrationLogger(
                    logger, isVerbose, 
                    "info", 
                    "Updating Astro Config..."
                );
                updateConfig({
                    image: {
                        service: imageService({
                            placeholder: "blurhash",
                            fallbackService: "squoosh",
                        }),
                    }
                });

                // Add routes for the database initialization page
                if (options.dbinitpage) {
                    integrationLogger(
                        logger, true, 
                        "warn", 
                        "Database Initialization Page Enabled, if you have already initialized your database, you may want to put 'dbinitpage: false` in your Astro Studio CMS Config. This will also prevent creating a new page on every server start."
                    );

                    const dbinitpage = resolve('./pages/happy-mongoose.astro');
                    const initPageUser = rootResolve('./src/pages/happy-mongoose.astro');

                    if ( !fs.existsSync(initPageUser) ) {
                        if (!fs.existsSync(rootResolve('./src/pages'))) {
                            try {
                                fs.mkdirSync(rootResolve('./src/pages'), { recursive: true });
                            } catch (err) {
                                console.error(err);
                            }
                        }
                        try {
                            fs.writeFileSync(initPageUser, fs.readFileSync(dbinitpage));
                        } catch (err) {
                            console.error(err);
                        }
                    }


                    // injectRoute({ 
                    //     pattern: `${config.base}happy-mongoose`, 
                    //     entrypoint: resolve('./pages/happy-mongoose.astro'), 
                    //     prerender: true,
                    // });
                }

                integrationLogger(
                    logger, isVerbose,
                    "info", 
                    "Astro Studio CMS Setup Complete!"
                );

            },
            // DEV MODE: Log a message to the console when the server starts to let the user know they need to initialize their database if it's their first time using Astro Studio CMS
            'astro:server:start': ({ logger }) => {
                if (options.dbinitpage) {
                    integrationLogger(
                        logger, true,
                        "info",
                        "If this is your first time using Astro Studio CMS, you may need to navigate to http://localhost:4321/happy-mongoose/ to initialize your database and remove any SQL errors."
                    )
                }
            }
        }
    }
})

