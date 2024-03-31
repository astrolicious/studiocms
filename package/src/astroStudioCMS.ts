import { // Tools and Utilities
    defineIntegration, 
    createResolver, 
    addVirtualImports,
    addIntegration, 
    hasIntegration
} from "astro-integration-kit";
import "astro-integration-kit/types/db";
import { AstroError } from "astro/errors";
import { loadEnv } from "vite";
import { integrationLogger } from "./utils";

// Integrations
import robots from "astro-robots";
import inoxsitemap from "@inox-tools/sitemap-ext";

// Image Services
import { 
    imageService as unpicImageService 
} from "@unpic/astro/service";
import { 
    passthroughImageService, 
    sharpImageService, 
    squooshImageService
} from "astro/config";

// Options Schema
import { optionsSchema } from "./schemas";

// Environment Variables
const env = loadEnv( "all", process.cwd(), "CMS");

export const AUTHKEYS = { 
    GITHUBCLIENTID: {
        N: "CMS_GITHUB_CLIENT_ID",
        KEY: env.CMS_GITHUB_CLIENT_ID 
        || import.meta.env.CMS_GITHUB_CLIENT_ID 
        || process.env.CMS_GITHUB_CLIENT_ID
    }, 
    GITHUBCLIENTSECRET: {
        N: "CMS_GITHUB_CLIENT_SECRET",
        KEY: env.CMS_GITHUB_CLIENT_SECRET
        || import.meta.env.CMS_GITHUB_CLIENT_SECRET 
        || process.env.CMS_GITHUB_CLIENT_SECRET
    }
};

export const CLOUDINARYCLOUDNAME = {
    N: "CMS_CLOUDINARY_CLOUDNAME",
    KEY: env.CMS_CLOUDINARY_CLOUDNAME
    || import.meta.env.CMS_CLOUDINARY_CLOUDNAME 
    || process.env.CMS_CLOUDINARY_CLOUDNAME
}

// Main Integration
export default defineIntegration({
    name: "astro-studiocms",
    optionsSchema,
    setup({ name, options, options: { verbose, dbStartPage, 
            authConfig: { mode: authMode }, 
            includedIntegrations: { astroRobots, inoxSitemap: useInoxSitemap },
            imageService: { astroImageServiceConfig, cdnPlugin, useUnpic, 
                unpicConfig: { fallbackService, layout, placeholder, cdnOptions }, 
            }, 
        },
    }) {
        // Create Resolver for Virtual Imports
        const { resolve } = createResolver(import.meta.url);

        return {
            "astro:db:setup": ({ extendDb }) => {
                extendDb({
                    configEntrypoint: resolve('./db/config.ts'),
                    seedEntrypoint: resolve('./db/seed.ts'), // Broken Solution is coming... @see https://github.com/withastro/astro/pull/10599
                });
            },
            "astro:config:setup": ( params ) => {
                
                const { 
                    addMiddleware, updateConfig, injectRoute, logger, command, config,
                    config: { base, adapter, output, site }
                } = params;

                // Check for SSR Mode
                if (output !== "server" ) {
                    throw new AstroError("Astro Studio CMS is only supported in 'Output: server' SSR mode.");
                };

                // Check for Site URL
                if (!site) {
                    throw new AstroError("Astro Studio CMS requires a 'site' configuration in your Astro Config. This can be your domain ( 'https://example.com' ) or localhost ( 'http://localhost:4321' - localhost should only be used during development and should not be used in production).");
                };

                // Add Virtual Imports
                integrationLogger(
                    logger, verbose, "info", "Adding Virtual Imports..."
                );
                addVirtualImports( params, {
                    name,
                    imports: {
                        'virtual:astro-studio-cms:config': `export default ${ JSON.stringify(options) }`,
                    },
                })

                // dbStartPage - Choose whether to run the Start Page or Inject the Integration
                if (dbStartPage) {
                    integrationLogger(logger, true, "warn", 
                        "Start Page Enabled.  This will be the only page available until you initialize your database. To get started, visit http://localhost:4321/start/ in your browser to initialize your database. And Setup your installation.");
                    injectRoute({
                        pattern: `${base}start/`,
                        entrypoint: resolve('./pages/start.astro'),
                    });
                    injectRoute({
                        pattern: `${base}done/`,
                        entrypoint: resolve('./pages/done.astro'),
                    });

                } else {

                    // Add Page Routes
                    integrationLogger(
                        logger, verbose, "info", "Adding Page Routes..."
                    );
                    injectRoute({ 
                        pattern: base, 
                        entrypoint: resolve('./pages/index.astro'), 
                    });
                    injectRoute({ 
                        pattern: "404", 
                        entrypoint: resolve('./pages/404.astro'), 
                    });
                    injectRoute({ 
                        pattern: `${base}about/`, 
                        entrypoint: resolve('./pages/about.astro'), 
                    });
                    injectRoute({ 
                        pattern: `${base}blog/`, 
                        entrypoint: resolve('./pages/blog/index.astro'), 
                    });
                    injectRoute({ 
                        pattern: `${base}blog/[slug]`, 
                        entrypoint: resolve('./pages/blog/[...slug].astro'), 
                    });
                    injectRoute({ 
                        pattern: `${base}rss.xml`, 
                        entrypoint: resolve('./pages/rss.xml.ts'), 
                    });

                    if (authMode === "disable") {
                        integrationLogger(
                            logger, verbose, "warn", 
                            "Authentication Disabled. The ENTIRE Internal dashboard for the Astro Studio CMS is disabled. This means you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build"
                        );
                    } else if (authMode === "built-in") {

                        if ( command === "build" ){
                            // Check for Required Environment Variables
                            if (!AUTHKEYS.GITHUBCLIENTID.KEY) {
                                throw new AstroError(`Using the Built-in Authentication requires the ${AUTHKEYS.GITHUBCLIENTID.N} environment variable to be set. Please add this to your .env file.`);
                            }
                            if (!AUTHKEYS.GITHUBCLIENTSECRET.KEY) {
                                throw new AstroError(`Using the Built-in Authentication requires the ${AUTHKEYS.GITHUBCLIENTSECRET.N} environment variable to be set. Please add this to your .env file.`);
                            }
                        }

                        // Add Authentication Middleware
                        integrationLogger(
                            logger, verbose, "info", "Adding Authentication Middleware"
                        );
                        addMiddleware({
                            entrypoint: resolve('./middleware/index.ts'),
                            order: "pre",
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/`, 
                            entrypoint: resolve('./pages/dashboard/index.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/profile/`, 
                            entrypoint: resolve('./pages/dashboard/profile.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/new-post/`, 
                            entrypoint: resolve('./pages/dashboard/new-post.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/post-list/`, 
                            entrypoint: resolve('./pages/dashboard/post-list.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/site-config/`, 
                            entrypoint: resolve('./pages/dashboard/site-config.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/admin-config/`, 
                            entrypoint: resolve('./pages/dashboard/admin-config.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/login/`, 
                            entrypoint: resolve('./pages/dashboard/login/index.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/edit/home/`, 
                            entrypoint: resolve('./pages/dashboard/edit/home.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/edit/about/`, 
                            entrypoint: resolve('./pages/dashboard/edit/about.astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/edit/[...slug]`, 
                            entrypoint: resolve('./pages/dashboard/edit/[...slug].astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/delete/[...slug]`, 
                            entrypoint: resolve('./pages/dashboard/delete/[...slug].astro'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/login/github`, 
                            entrypoint: resolve('./pages/dashboard/login/github/index.ts'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/login/github/callback`, 
                            entrypoint: resolve('./pages/dashboard/login/github/callback.ts'), 
                        });
                        injectRoute({ 
                            pattern: `${base}dashboard/logout`, 
                            entrypoint: resolve('./pages/dashboard/logout.ts'), 
                        });
                    } else if (authMode === "plugin") {
                        integrationLogger(
                            logger, verbose, "warn", 
                            "Authentication Plugins are not supported. Please use the built-in Astro Studio CMS authentication. or Disable Authentication in your Astro Config, to manage your content via the Astro Studio Dashboard at http://studio.astro.build"
                        );
                    }

                };


                // Setup and Configure Astro Adapters and Image Services based on the Adapter and Image Service Configurations
                integrationLogger(
                    logger, verbose, "info", "Determining Astro Adapter Configuration"
                );

                //
                // NODE ADAPTER CONFIGS
                //
                if ( adapter?.name === "@astrojs/node" ) {
                    integrationLogger(
                        logger, verbose, "info", "Node Adapter Detected. Using Node Adapter."
                    );

                    // Setup Image Service
                    if ( cdnPlugin === "cloudinary-js" ) {
                        if (!CLOUDINARYCLOUDNAME.KEY){
                            throw new AstroError(`Using the Cloudinary CDN JS SDK Plugin requires the ${CLOUDINARYCLOUDNAME.N} environment variable to be set. Please add this to your .env file.`);
                        }
                        if ( astroImageServiceConfig === "squoosh" ) {
                            integrationLogger(logger, verbose, "info", "Using Squoosh Image Service as Fallback for Cloudinary CDN Plugin")
                            updateConfig({
                                image: { service: squooshImageService(), }
                            })
                        } else if ( astroImageServiceConfig === "sharp" ) {
                            integrationLogger(logger, verbose, "info", "Using Sharp Image Service as Fallback for Cloudinary CDN Plugin")
                            updateConfig({
                                image: { service: sharpImageService(), }
                            })
                        } else if ( astroImageServiceConfig === "no-op" ) {
                            integrationLogger(logger, verbose, "info", "Using No-Op Image Service as Fallback for Cloudinary CDN Plugin")
                            updateConfig({
                                image: { service: passthroughImageService(), }
                            })
                        }
                    } else if ( useUnpic && astroImageServiceConfig !== "no-op" ) {
                        integrationLogger(logger, verbose, "info", "Loading @unpic/astro Image Service for External Images")
                        updateConfig({
                            image: {
                                service: unpicImageService({
                                    placeholder: placeholder,
                                    fallbackService: fallbackService ? fallbackService : astroImageServiceConfig,
                                    layout: layout,
                                    cdnOptions: cdnOptions,
                                }),
                            }
                        });
                    } else if ( useUnpic && astroImageServiceConfig === "no-op" ) {
                        integrationLogger(logger, verbose, "info", "Loading @unpic/astro Image Service for External Images")
                        updateConfig({
                            image: {
                                service: unpicImageService({
                                    placeholder: placeholder,
                                    fallbackService: fallbackService ? fallbackService : "astro",
                                    layout: layout,
                                    cdnOptions: cdnOptions,
                                }),
                            }
                        });
                    } else {
                        integrationLogger(logger, verbose, "info", "@unpic/astro Image Service Disabled, using Astro Built-in Image Service.")
                        if ( astroImageServiceConfig === "squoosh" ) {
                            integrationLogger(logger, verbose, "info", "Using Squoosh Image Service")
                            updateConfig({
                                image: { service: squooshImageService(), }
                            })
                        } else if ( astroImageServiceConfig === "sharp" ) {
                            integrationLogger(logger, verbose, "info", "Using Sharp Image Service")
                            updateConfig({
                                image: { service: sharpImageService(), }
                            })
                        } else if ( astroImageServiceConfig === "no-op" ) {
                            integrationLogger(logger, verbose, "info", "Using No-Op Image Service")
                            updateConfig({
                                image: { service: passthroughImageService(), }
                            })
                        }
                    }

                //
                // VERCEL ADAPTER CONFIGS
                //
                } else if ( adapter?.name === "@astrojs/vercel/serverless" ) {
                    integrationLogger(
                        logger, verbose, "info", "Vercel Adapter Detected. Using Vercel Adapter."
                    );

                    // Setup Image Service
                    if ( command === "build" && config.image.service.entrypoint === "@astrojs/vercel/build-image-service" ) {
                        integrationLogger(
                            logger, verbose, "info", "Vercel Image Service Enabled. Using Vercel Image Service."
                        );
                    } else {
                        integrationLogger(
                            logger, verbose, "info", "Vercel Image Service Disabled. Using Astro Built-in Image Service."
                        );
                        if ( cdnPlugin === "cloudinary-js" ) {
                            if (!CLOUDINARYCLOUDNAME.KEY){
                                throw new AstroError(`Using the Cloudinary CDN JS SDK Plugin requires the ${CLOUDINARYCLOUDNAME.N} environment variable to be set. Please add this to your .env file.`);
                            }
                            if ( astroImageServiceConfig === "squoosh" ) {
                                integrationLogger(logger, verbose, "info", "Using Squoosh Image Service as Fallback for Cloudinary CDN Plugin")
                                updateConfig({
                                    image: { service: squooshImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "sharp" ) {
                                integrationLogger(logger, verbose, "info", "Using Sharp Image Service as Fallback for Cloudinary CDN Plugin")
                                updateConfig({
                                    image: { service: sharpImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "no-op" ) {
                                integrationLogger(logger, verbose, "info", "Using No-Op Image Service as Fallback for Cloudinary CDN Plugin")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            }
                        } else if ( useUnpic && astroImageServiceConfig !== "no-op" ) {
                            integrationLogger(logger, verbose, "info", "Loading @unpic/astro Image Service for External Images")
                            updateConfig({
                                image: {
                                    service: unpicImageService({
                                        placeholder: placeholder,
                                        fallbackService: fallbackService ? fallbackService : astroImageServiceConfig,
                                        layout: layout,
                                        cdnOptions: cdnOptions,
                                    }),
                                }
                            });
                        } else if ( useUnpic && astroImageServiceConfig === "no-op" ) {
                            integrationLogger(logger, verbose, "info", "Loading @unpic/astro Image Service for External Images")
                            updateConfig({
                                image: {
                                    service: unpicImageService({
                                        placeholder: placeholder,
                                        fallbackService: fallbackService ? fallbackService : "astro",
                                        layout: layout,
                                        cdnOptions: cdnOptions,
                                    }),
                                }
                            });
                        } else {
                            integrationLogger(logger, verbose, "info", "@unpic/astro Image Service Disabled, using Astro Built-in Image Service.")
                            if ( astroImageServiceConfig === "squoosh" ) {
                                integrationLogger(logger, verbose, "info", "Using Squoosh Image Service")
                                updateConfig({
                                    image: { service: squooshImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "sharp" ) {
                                integrationLogger(logger, verbose, "info", "Using Sharp Image Service")
                                updateConfig({
                                    image: { service: sharpImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "no-op" ) {
                                integrationLogger(logger, verbose, "info", "Using No-Op Image Service")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            }
                        }
                    }

                //
                // NETLIFY ADAPTER CONFIGS
                //
                } else if ( adapter?.name === "@astrojs/netlify" ) {
                    integrationLogger(
                        logger, verbose, "info", "Netlify Adapter Detected. Using Netlify Adapter."
                    );

                    // Setup Image Service
                    if ( config.image?.service.entrypoint === "@astrojs/netlify/image-service.js" ) {
                        integrationLogger(
                            logger, verbose, "info", "Netlify Image Service Enabled. Using Netlify Image Service."
                        );
                    } else {
                        integrationLogger(logger, verbose, "info", "Netlify Image Service Disabled. Using Built-in Image Service.")
                        if ( cdnPlugin === "cloudinary-js" ) {
                            if (!CLOUDINARYCLOUDNAME.KEY){
                                throw new AstroError(`Using the Cloudinary CDN JS SDK Plugin requires the ${CLOUDINARYCLOUDNAME.N} environment variable to be set. Please add this to your .env file.`);
                            }
                            if ( astroImageServiceConfig === "squoosh" ) {
                                integrationLogger(logger, verbose, "info", "Using Squoosh Image Service as Fallback for Cloudinary CDN Plugin")
                                updateConfig({
                                    image: { service: squooshImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "sharp" ) {
                                integrationLogger(logger, verbose, "info", "Using Sharp Image Service as Fallback for Cloudinary CDN Plugin")
                                updateConfig({
                                    image: { service: sharpImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "no-op" ) {
                                integrationLogger(logger, verbose, "info", "Using No-Op Image Service as Fallback for Cloudinary CDN Plugin")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            }
                        } else if ( useUnpic && astroImageServiceConfig !== "no-op" ) {
                            integrationLogger(logger, verbose, "info", "Loading @unpic/astro Image Service for External Images")
                            updateConfig({
                                image: {
                                    service: unpicImageService({
                                        placeholder: placeholder,
                                        fallbackService: fallbackService ? fallbackService : astroImageServiceConfig,
                                        layout: layout,
                                        cdnOptions: cdnOptions,
                                    }),
                                }
                            });
                        } else if ( useUnpic && astroImageServiceConfig === "no-op" ) {
                            integrationLogger(logger, verbose, "info", "Loading @unpic/astro Image Service for External Images")
                            updateConfig({
                                image: {
                                    service: unpicImageService({
                                        placeholder: placeholder,
                                        fallbackService: fallbackService ? fallbackService : "astro",
                                        layout: layout,
                                        cdnOptions: cdnOptions,
                                    }),
                                }
                            });
                        } else {
                            integrationLogger(logger, verbose, "info", "@unpic/astro Image Service Disabled, using Astro Built-in Image Service.")
                            if ( astroImageServiceConfig === "squoosh" ) {
                                integrationLogger(logger, verbose, "info", "Using Squoosh Image Service")
                                updateConfig({
                                    image: { service: squooshImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "sharp" ) {
                                integrationLogger(logger, verbose, "info", "Using Sharp Image Service")
                                updateConfig({
                                    image: { service: sharpImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "no-op" ) {
                                integrationLogger(logger, verbose, "info", "Using No-Op Image Service")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            }
                        }
                    }

                //
                // CLOUDFLARE ADAPTER CONFIGS
                //
                } else if ( adapter?.name === "@astrojs/cloudflare" ) {
                    integrationLogger(
                        logger, verbose, "info", "Cloudflare Adapter Detected. Using Cloudflare Adapter."
                    );
                    
                    // Setup Image Service
                    if ( config.image?.service.entrypoint === "@astrojs/cloudflare/image-endpoint" ) {
                        integrationLogger(
                            logger, verbose, "info", "Cloudflare Image Service Enabled. Using Cloudflare Image Service."
                        );
                    } else {
                        integrationLogger(logger, verbose, "info", "Cloudflare Image Service Disabled. Using Built-in Image Service.")

                        if ( cdnPlugin === "cloudinary-js" ) {
                            if (!CLOUDINARYCLOUDNAME.KEY){
                                throw new AstroError(`Using the Cloudinary CDN JS SDK Plugin requires the ${CLOUDINARYCLOUDNAME.N} environment variable to be set. Please add this to your .env file.`);
                            }
                            if ( astroImageServiceConfig === "squoosh" ) {
                                integrationLogger(logger, verbose, "warn", "Cloudflare SSR does not support Squoosh Image Service. Using no-op Service as astroImageServiceConfig is set to 'squoosh'")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "sharp" ) {
                                integrationLogger(logger, verbose, "warn", "Cloudflare SSR does not support Sharp Image Service. Using no-op Service as astroImageServiceConfig is set to 'sharp'")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "no-op" ) {
                                integrationLogger(logger, verbose, "info", "Using No-Op Image Service as Fallback for Cloudinary CDN Plugin")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            }
                        } else if ( useUnpic && astroImageServiceConfig !== "no-op" ) {
                            integrationLogger(logger, verbose, "info", "Loading @unpic/astro Image Service for External Images")
                            updateConfig({
                                image: {
                                    service: unpicImageService({
                                        placeholder: placeholder,
                                        fallbackService: fallbackService ? fallbackService : "astro",
                                        layout: layout,
                                        cdnOptions: cdnOptions,
                                    }),
                                }
                            });
                        } else if ( useUnpic && astroImageServiceConfig === "no-op" ) {
                            integrationLogger(logger, verbose, "info", "Loading @unpic/astro Image Service for External Images")
                            updateConfig({
                                image: {
                                    service: unpicImageService({
                                        placeholder: placeholder,
                                        fallbackService: fallbackService ? fallbackService : "astro",
                                        layout: layout,
                                        cdnOptions: cdnOptions,
                                    }),
                                }
                            });
                        } else {
                            integrationLogger(logger, verbose, "info", "@unpic/astro Image Service Disabled, using Astro Built-in Image Service.")
                            if ( astroImageServiceConfig === "squoosh" ) {
                                integrationLogger(logger, verbose, "info", "Cloudflare SSR does not support Squoosh Image Service. Using no-op Service as astroImageServiceConfig is set to 'squoosh'")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "sharp" ) {
                                integrationLogger(logger, verbose, "info", "Cloudflare SSR does not support Sharp Image Service. Using no-op Service as astroImageServiceConfig is set to 'sharp'")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            } else if ( astroImageServiceConfig === "no-op" ) {
                                integrationLogger(logger, verbose, "info", "Using No-Op Image Service")
                                updateConfig({
                                    image: { service: passthroughImageService(), }
                                })
                            }
                        }
                    }

                }

                // Robots.txt Integration
                if ( astroRobots ) {
                    if ( !hasIntegration(params, { name: "astro-robots-txt" }) 
                        || !hasIntegration( params, { name: "astro-robots" }) ) {
                        integrationLogger(logger, verbose, "info", "No known robotstxt integration found. Adding `astro-robots` integration")
                        addIntegration(params, { integration: robots({
                            policy: [ { 
                                userAgent: ["*"],
                                allow: ["/"],
                                disallow: ["/dashboard/"],
                            }, ],
                        })});
                    }
                }
    
                // Sitemap Integration
                if ( useInoxSitemap ) {
                    if ( !hasIntegration(params, { name: "@astrojs/sitemap" }) 
                    || !hasIntegration(params, { name: "@inox-tools/sitemap-ext"}) ) {
                        integrationLogger(logger, verbose, "info", "No known sitemap integration found. Adding `@inox-tools/sitemap-ext` integration")
                        addIntegration(params, { integration: inoxsitemap()});
                    }
                }

                integrationLogger(
                    logger, verbose, "info", "Astro Studio CMS Setup Complete!"
                );

            },
            'astro:server:start': ({ logger }) => {
                if (dbStartPage) {
                    integrationLogger(
                        logger, true, "warn", "Astro Studio CMS is running in Development Mode. To get started, visit http://localhost:4321/start in your browser to initialize your database. And Setup your installation."
                    );
                };
            },
        };
    },
});