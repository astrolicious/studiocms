import { defineDbIntegration } from '@astrojs/db/utils';
import { integrationLogger } from './utils';
import { createResolver } from "astro-integration-kit";
import type { Options } from "./schemas";
import astroStudioCMS from "./astroStudioCMS";

/**
 * AstroStudioCMS Integration - Experimental
 * @description This integration is meant to allow users to use Astro Studio and AstroDB to create a CMS for their Astro sites. using `output: "server"`, and `@astrojs/db`.
 * @param verbose - Enable verbose logging
 * @param dbStartPage - Enable Integration Starting/Setup Page
 * @example
 * ```ts
 * import { defineConfig } from "astro/config";
 * import studioCMS from "@nametbd/astro-studio-cms";
 * import db from '@astrojs/db';
 * 
 * // https://astro.build/config
 * export default defineConfig({
 *  site: 'https://example.com',
 *  output: "server",
 *  adapters: YourAdapterHere(),
 *  integrations: [
 *      db(),
 *      StudioCMS({
 *          dbStartPage: boolean,
 *          verbose: boolean,
 *      }),
 *  ],
 * });
```
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

                // Inject the actual integration that handles everything besides the database...
                updateConfig({
                    integrations: [astroStudioCMS(options)]
                })
    
            }

            
        },
    });
}