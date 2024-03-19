import { imageService } from "@unpic/astro/service";
import { AstroError } from "astro/errors";
import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { loadEnv } from "vite";
import { optionsSchema } from "./schemas";
import { integrationLogger } from "./utils";
import dbInject from "./db/integration";
import fs from "node:fs";

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
                addDts,
                updateConfig,
                config,
                logger,
                injectRoute,
            }) => {
                // Create Resolver for Virtual Imports
                const { resolve } = createResolver(import.meta.url);
                const { resolve: rootResolve } = createResolver(config.root.pathname)
                
                // Check for Astro Version
                const astroPackagePath = rootResolve('./node_modules/astro/package.json');
                const astroPackage = JSON.parse(fs.readFileSync(astroPackagePath, 'utf-8'));
                const astroVersion = astroPackage.version;

                if (astroVersion < "4.5.5") {
                    throw new AstroError("Astro Studio CMS requires Astro 4.5.5 or later.");
                }

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
                    'virtual:astro-studio-cms:layout': `export { default as VirtualLayout } from '${resolve('./layouts/Virtual.astro')}'`,
                })

                addDts({
                    name: "virtual:astro-studio-cms",
                    content: `
                        declare module 'virtual:astro-studio-cms:layout' {
                            export const VirtualLayout: typeof import('${resolve('./layouts/Virtual.astro')}');
                        }
                    `
                })

                // dbStartPage - Choose whether to run the Start Page or Inject the Integration
                if (options.dbStartPage) {
                    integrationLogger(logger, true, "warn", 
                        "Start Page Enabled.  This will be the only page available until you initialize your database. To get started, visit http://localhost:4321/start in your browser to initialize your database. And Setup your installation.");
                    
                    const dbinitpage = resolve('./pages/start.astro');
                    const initPageUser = rootResolve('./src/pages/start.astro');

                    if ( !fs.existsSync(initPageUser) ) {
                        if (!fs.existsSync(rootResolve('./src/pages'))) {
                            try { 
                                fs.mkdirSync(rootResolve('./src/pages'), { recursive: true });
                            } catch (err) { 
                                logger.debug(err as string); 
                            }
                        } try { 
                            fs.writeFileSync(initPageUser, fs.readFileSync(dbinitpage));
                        } catch (err) { 
                            logger.debug(err as string); 
                        }
                    }

                    injectRoute({
                        pattern: `${config.base}done/`,
                        entrypoint: resolve('./pages/done.astro'),
                    })

                } else {
                    // Add Authentication Middleware
                    integrationLogger(
                        logger, isVerbose, "info", "Adding Authentication Middleware"
                    );
                    addMiddleware({
                        entrypoint: resolve('./middleware/index.ts'),
                        order: "post",
                    });

                    // Add Page Routes
                    integrationLogger(
                        logger, isVerbose, "info", "Adding Page Routes..."
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
                        pattern: `${config.base}dashboard/site-config`, 
                        entrypoint: resolve('./pages/dashboard/site-config.astro'), 
                    });
                    injectRoute({ 
                        pattern: `${config.base}dashboard/admin-config`, 
                        entrypoint: resolve('./pages/dashboard/admin-config.astro'), 
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

                }

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

                integrationLogger(
                    logger, isVerbose,
                    "info", 
                    "Astro Studio CMS Setup Complete!"
                );

            },
            'astro:server:start': ({ logger }) => {
                if (options.dbStartPage) {
                    integrationLogger(
                        logger, true,
                        "warn",
                        "Astro Studio CMS is running in Development Mode. To get started, visit http://localhost:4321/start in your browser to initialize your database. And Setup your installation."
                    )
                }
            }
        }
    }
})

