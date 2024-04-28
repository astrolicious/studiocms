import type { AstroIntegration } from 'astro';
import type { AstroStudioCMSOptions } from './schemas';

/**
 * # Astro Studio CMS Integration
 * A CMS built for Astro by the Astro Community for the Astro Community.
 *
 * Checkout our [GitHub Repo `@astrolicious/studiocms`](https://github.com/astrolicious/)
 *
 * Check out [Astro-StudioCMS.xyz](https://astro-studiocms.xyz) or the Built-in JSDocs *(Hover Docs like this)* for more information.
 *
 * > **Note: Astro SSR adapters that are configured for Image Optimization will automatically take full control of the Image Optimization Service. Making the `imageService` option in this integration not have any effect.**
 *
 */
export default function studioCMS(options?: AstroStudioCMSOptions): AstroIntegration;
