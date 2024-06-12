import type { StudioCMSOptions } from './schemas';
import coreIntegration from './coreIntegration';
import { studioCMSRobotsTXT as robotsTXT } from './integrations';
export * from './plugintools';

/**
 * A utility function to define the StudioCMS config object. 
 * This function is used to define the optional StudioCMS 
 * config object in the Astro project root. The expected file 
 * name is `studiocms.config.mjs`. And it should be adjacent
 * to the Astro project's `astro.config.mjs` file.
 * 
 * StudioCMS will attempt to import this file and use the default 
 * export as the StudioCMS config object authomatically if it exists.
 * 
 * Using this function is optional, but it can be useful for IDEs 
 * to provide better intellisense and type checking.
 * 
 * @example
 * ```js
 * // studiocms.config.mjs
 * import { defineStudioCMSConfig } from '@astrolicious/studiocms';
 * 
 * export default defineStudioCMSConfig({
 *  dbStartPage: true,
 *  contentRenderer: 'marked',
 *  verbose: true,
 *  dateLocale: 'en-us',
 *  // ...Other Options
 * })
 * ```
 * 
 */
export function defineStudioCMSConfig(config: StudioCMSOptions) {
    return config;
}

/**
 * # Astro Studio CMS Integration
 * 
 * A CMS built for Astro by the Astro Community for the Astro Community.
 *
 * Checkout our [GitHub Repo `@astrolicious/studiocms`](https://github.com/astrolicious/studiocms)
 *
 * Check out [Astro-StudioCMS.xyz](https://astro-studiocms.xyz) or the Built-in JSDocs *(Hover Docs like this)* for more information.
 *
 * > **Note: Astro SSR adapters that are configured for Image Optimization will automatically take full control of the Image Optimization Service. Making the `imageService` option in this integration not have any effect.**
 *
 */
export const studioCMSCoreIntegration = coreIntegration;

/**
 * # Astro Studio CMS Robots.txt Integration
 * 
 * This is the built-in `robots.txt` integration for Astro Studio CMS. Integration is based on the `astro-robots-txt` package.
 * 
 * This integration is automatically included with the Astro Studio CMS Core Integration. But can be used independently if needed.
 */
export const studioCMSRobotsTXT = robotsTXT;

export default studioCMSCoreIntegration;
