import { defineDbIntegration } from '@astrojs/db/utils';
import { integrationLogger } from './utils';
import { createResolver } from "astro-integration-kit";
import type { Options } from "./schemas";
import astroStudioCMS from "./astroStudioCMS";

// This is the integration that will be used to link the database to the Astro Studio CMS
/**
 * AstroStudioCMS Database config & seed Integration
 */
export default function StudioCMS(options?: Options) {
    const { resolve } = createResolver(import.meta.url);

    return defineDbIntegration({
        name: 'astro-studio-cms-db',
        hooks: {
            'astro:db:setup': ({ extendDb }) => {
                extendDb({
                    configEntrypoint: resolve('./db/config.ts'),
                    seedEntrypoint: resolve('./db/seed.ts'),
                });
            },
            'astro:config:setup': ({ logger, updateConfig }) => {
                integrationLogger(logger, true, 'info', 'Custom AstroDB configuration loaded!');

                updateConfig({
                    integrations: [astroStudioCMS(options)]
                })
    
            }

            
        },
    });
}