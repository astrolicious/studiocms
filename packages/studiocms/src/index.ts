import { defineStudioCMSConfig, defineStudioCMSPlugin } from '@studiocms/core/lib';
import type { StudioCMSPluginOptions } from '@studiocms/core/types';
import integration from './integration';

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
export const studioCMS = integration;

export default studioCMS;

// Config Utility
export { defineStudioCMSConfig };

// Plugin System
export { defineStudioCMSPlugin, type StudioCMSPluginOptions };
