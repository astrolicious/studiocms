import { defineDbIntegration } from '@astrojs/db/utils';
import { integrationLogger } from '../utils';
import { createResolver } from "astro-integration-kit";

// This is the integration that will be used to link the database to the Astro Studio CMS
/**
 * AstroStudioCMS Database config & seed Integration
 */
export default function StudioCMS() {
    const { resolve } = createResolver(import.meta.url);

    return defineDbIntegration({
        name: 'astro-studio-cms-db',
        hooks: {
            'astro:db:setup': ({ extendDb }) => {
                extendDb({
                    configEntrypoint: resolve('./config.ts'),
                    seedEntrypoint: resolve('./seed.ts'),
                });
            },
            'astro:config:setup': ({ logger }) => {
                integrationLogger(logger, true, 'info', 'Custom AstroDB configuration loaded!');
            }
        },
    });
}