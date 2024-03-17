import { defineDbIntegration } from '@astrojs/db/utils';

// This is the integration that will be used to link the database to the Astro Studio CMS
/**
 * AstroStudioCMS Database link & seed Integration
 */
export default function StudioCMS() {
    return defineDbIntegration({
        name: 'astro-studio-cms-dblink',
        hooks: {
            'astro:db:setup': ({ extendDb }) => {
                extendDb({
                    configEntrypoint: '@nametbd/astro-studio-cms/config.ts',
                    seedEntrypoint: '@nametbd/astro-studio-cms/seed.ts',
                });
            },
            'astro:config:setup': ({ logger }) => {
                logger.info('Astro Studio CMS Database Integration Enabled');

            }
        },
    });
}