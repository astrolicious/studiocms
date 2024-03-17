import { defineDbIntegration } from '@astrojs/db/utils';
import { integrationLogger } from '../utils';

// This is the integration that will be used to link the database to the Astro Studio CMS
/**
 * AstroStudioCMS Database config & seed Integration
 */
export default function StudioCMS() {
    return defineDbIntegration({
        name: 'astro-studio-cms-db',
        hooks: {
            'astro:db:setup': ({ extendDb }) => {
                extendDb({
                    configEntrypoint: '@nametbd/astro-studio-cms/config.ts',
                    seedEntrypoint: '@nametbd/astro-studio-cms/seed.ts',
                });
            },
            'astro:config:setup': ({ logger }) => {
                integrationLogger(logger, true, 'info', 'Custom AstroDB configuration loaded!');

            }
        },
    });
}