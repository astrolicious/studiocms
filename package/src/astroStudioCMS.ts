import { imageService } from "@unpic/astro/service";
import { AstroError } from "astro/errors";
import { loadEnv } from "vite";
import { optionsSchema } from "./schemas";
import { integrationLogger } from "./utils";
import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import "astro-integration-kit/types/db";
import { sharpImageService, squooshImageService } from "astro/config";

const { 
    CMS_GITHUB_CLIENT_ID, 
    CMS_GITHUB_CLIENT_SECRET, 
    CMS_WATCH_INTEGRATION_HOOK 
} = loadEnv( "all", process.cwd(), "CMS");

export default defineIntegration({
    name: "astro-studiocms",
    optionsSchema,
    plugins: [...corePlugins],
    setup({ options }) {
        // Destructure Options
        const { 
            verbose: isVerbose, 
            imageService: ImageServiceConfig,
            dbStartPage, authConfig,
        } = options;
        
        const { mode: authMode } = authConfig;

        const { 
            astroImageServiceConfig, 
            useUnpic, 
            unpicConfig 
        } = ImageServiceConfig;

        const { 
            fallbackService, 
            layout, 
            placeholder, 
            cdnOptions 
        } = unpicConfig;

        // Create Resolver for Virtual Imports
        const { resolve } = createResolver(import.meta.url);

        return {
            "astro:db:setup": ({ extendDb }) => {
                extendDb({
                    configEntrypoint: resolve('./db/config.ts'),
                    seedEntrypoint: resolve('./db/seed.ts'),
                });
            },
            "astro:config:setup": ({ 
                watchIntegration, 
                addMiddleware,
                addVirtualImports,
                updateConfig,
                config,
                logger,
                injectRoute,
            }) => {
                
                // Watch Integration for changes in dev mode
                if (CMS_WATCH_INTEGRATION_HOOK) {
                    integrationLogger(logger.fork("Astro-StudioCMS-Dev"), isVerbose, "warn", "Watching Integration for Changes... This should only be enabled during Development of the Integration.")
                    watchIntegration(resolve());
                }

                const { 
                    site: DomainName, 
                    output: RenderMode, 
                    base: BaseURL 
                } = config;

                // Check for SSR Mode
                if (RenderMode !== "server" ) {
                    throw new AstroError("Astro Studio CMS is only supported in 'Output: server' SSR mode.");
                };

                // Check for Site URL
                if (!DomainName) {
                    throw new AstroError("Astro Studio CMS requires a 'site' configuration in your Astro Config.");
                };

                // Add Virtual Imports
                integrationLogger(
                    logger, isVerbose, 
                    "info", 
                    "Adding Virtual Imports..."
                );
                addVirtualImports({
                    'virtual:astro-studio-cms:config': `export default ${JSON.stringify(options) };`,
                    'virtual:astro-studio-cms:layout': `export { default as VirtualLayout } from '${resolve('./layouts/Virtual.astro')}'`,
                });

                // dbStartPage - Choose whether to run the Start Page or Inject the Integration
                if (dbStartPage) {
                    integrationLogger(logger, true, "warn", 
                        "Start Page Enabled.  This will be the only page available until you initialize your database. To get started, visit http://localhost:4321/start/ in your browser to initialize your database. And Setup your installation.");
                    injectRoute({
                        pattern: `${BaseURL}start/`,
                        entrypoint: resolve('./pages/start.astro'),
                    });
                    injectRoute({
                        pattern: `${BaseURL}done/`,
                        entrypoint: resolve('./pages/done.astro'),
                    });

                } else {

                    // Add Page Routes
                    integrationLogger(
                        logger, isVerbose, "info", "Adding Page Routes..."
                    );
                    injectRoute({ 
                        pattern: BaseURL, 
                        entrypoint: resolve('./pages/index.astro'), 
                    });
                    injectRoute({ 
                        pattern: `${BaseURL}about/`, 
                        entrypoint: resolve('./pages/about.astro'), 
                    });
                    injectRoute({ 
                        pattern: `${BaseURL}blog/`, 
                        entrypoint: resolve('./pages/blog/index.astro'), 
                    });
                    injectRoute({ 
                        pattern: `${BaseURL}blog/[slug]`, 
                        entrypoint: resolve('./pages/blog/[...slug].astro'), 
                    });
                    injectRoute({ 
                        pattern: `${BaseURL}rss.xml`, 
                        entrypoint: resolve('./pages/rss.xml.ts'), 
                    });

                    if (authMode === "disable") {
                        integrationLogger(
                            logger, isVerbose, "warn", 
                            "Authentication Disabled. The ENTIRE Internal dashboard for the Astro Studio CMS is disabled. This means you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build"
                        );
                    } else if (authMode === "built-in") {

                        // Check for Required Environment Variables
                        if (!CMS_GITHUB_CLIENT_ID || !CMS_GITHUB_CLIENT_SECRET) {
                            throw new AstroError("GitHub OAuth Client ID and Secret are required to use Astro Studio CMS with the built-in authentication. Please add these to your .env file.");
                        };

                        // Add Authentication Middleware
                        integrationLogger(
                            logger, isVerbose, "info", "Adding Authentication Middleware"
                        );
                        addMiddleware({
                            entrypoint: resolve('./middleware/index.ts'),
                            order: "post",
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/`, 
                            entrypoint: resolve('./pages/dashboard/index.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/profile`, 
                            entrypoint: resolve('./pages/dashboard/profile.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/new-post`, 
                            entrypoint: resolve('./pages/dashboard/new-post.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/post-list`, 
                            entrypoint: resolve('./pages/dashboard/post-list.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/site-config`, 
                            entrypoint: resolve('./pages/dashboard/site-config.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/admin-config`, 
                            entrypoint: resolve('./pages/dashboard/admin-config.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/login`, 
                            entrypoint: resolve('./pages/dashboard/login/index.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/edit/home`, 
                            entrypoint: resolve('./pages/dashboard/edit/home.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/edit/about`, 
                            entrypoint: resolve('./pages/dashboard/edit/about.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/edit/[...slug]`, 
                            entrypoint: resolve('./pages/dashboard/edit/[...slug].astro'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/login/github`, 
                            entrypoint: resolve('./pages/dashboard/login/github/index.ts'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/login/github/callback`, 
                            entrypoint: resolve('./pages/dashboard/login/github/callback.ts'), 
                        });
                        injectRoute({ 
                            pattern: `${BaseURL}dashboard/logout`, 
                            entrypoint: resolve('./pages/dashboard/logout.ts'), 
                        });
                    } else if (authMode === "plugin") {
                        integrationLogger(
                            logger, isVerbose, "warn", 
                            "Plugin Authentication is not yet supported. Please use the built-in Astro Studio CMS authentication."
                        );
                    }

                };

                // Update Astro Config
                integrationLogger(
                    logger, isVerbose, 
                    "info", 
                    "Updating Astro Config..."
                );

                if (useUnpic) {
                    integrationLogger(logger, isVerbose, "info", "Loading @unpic/astro Image Service for External Images")
                    updateConfig({
                        image: {
                            service: imageService({
                                placeholder: placeholder,
                                fallbackService: fallbackService,
                                layout: layout,
                                cdnOptions: cdnOptions,
                            }),
                        }
                    });
                } else {
                    integrationLogger(logger, isVerbose, "info", "@unpic/astro Image Service Disabled, using Astro Built-in Image Service.")
                    if (astroImageServiceConfig === "squoosh") {
                        integrationLogger(logger, isVerbose, "info", "Using Squoosh Image Service")
                        updateConfig({
                            image: { service: squooshImageService(), }
                        })
                    } else if (astroImageServiceConfig === "sharp") {
                        integrationLogger(logger, isVerbose, "info", "Using Sharp Image Service")
                        updateConfig({
                            image: { service: sharpImageService(), }
                        })
                    }
                }

                integrationLogger(
                    logger, isVerbose, "info", 
                    "Astro Studio CMS Setup Complete!"
                );

            },
            'astro:server:start': ({ logger }) => {
                if (dbStartPage) {
                    integrationLogger(
                        logger, true,
                        "warn",
                        "Astro Studio CMS is running in Development Mode. To get started, visit http://localhost:4321/start in your browser to initialize your database. And Setup your installation."
                    );
                };
            },
        };
    },
});