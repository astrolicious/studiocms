import { PLUGIN_INTEGRATION_ICON } from './constVars';
import coreIntegration from './coreIntegration';
import { studioCMSRobotsTXT as robotsTXT } from './integrations';
import type { usernameAndPasswordConfig } from './integrations/studioCMSDashboard/schemas';
import type { StudioCMSOptions } from './schemas';

export type { StudioCMSOptions, usernameAndPasswordConfig };

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
export default studioCMSCoreIntegration;

/**
 * # Astro Studio CMS Robots.txt Integration
 *
 * This is the built-in `robots.txt` integration for Astro Studio CMS. Integration is based on the `astro-robots-txt` package.
 *
 * This integration is automatically included with the Astro Studio CMS Core Integration. But can be used independently if needed.
 */
export const studioCMSRobotsTXT = robotsTXT;

// Sidebar link type
/**
 * Reference from StudioCMS-Dashboard routemap.ts
 */
type SideBarLink = {
	/** Unique link ID */
	id: string;
	/** URL to redirect to */
	href: string;
	/** Text to display for the link */
	text: string;
	/** Minimum permission level required to view the link (unkown/visitor/editor/admin) */
	minPermissionLevel: string;
	/** Icon to display for the link ( icon: 'data:image/svg+xml;base64,PH...) */
	icon: string;
	/** Type of link (link/dropdown) */
	type: 'link' | 'dropdown';
	/** Dropdown items for dropdown links (Requires `type: 'dropdown'`) */
	dropdownItems?: SideBarLink[];
};

export type DashboardPageLink = {
	/** Label for the link */
	label: string;
	/** URL to redirect to */
	link: string;
	/** Minimum permission level required to view the link (unkown/visitor/editor/admin) */
	minRole: 'unknown' | 'visitor' | 'editor' | 'admin';
	/** Icon to display for the link ( icon: 'data:image/svg+xml;base64,PH...) */
	icon: string;
	/** Type of link (link/dropdown) */
	type: 'link' | 'dropdown';
	/** Dropdown items for dropdown links (Requires `type: 'dropdown'`) */
	dropdownChildren?: DashboardPageLink[];
};

export type StudioCMSPluginOptions = {
	/**
	 * The Package Name of the Plugin
	 */
	pkgname: string;
	/**
	 * The Options for the Plugin
	 */
	opts: {
		/**
		 * The Label for the Plugin used in the Dashboard
		 */
		pluginLabel: string;
		/**
		 * The Front-end Navigation Links for the Plugin
		 */
		navigationLinks?: {
			text: string;
			slug: string;
		}[];
		/**
		 * Custom Dashboard pages for the Plugin
		 */
		dashboardPageLinks?: DashboardPageLink[];
		/**
		 * The Custom Renderer Plugin Path - This is used to replace the built-in Markdown Renderer. Recommended for Advanced Users.
		 */
		customRendererPluginPath?: string;
	};
};

/**
 * # Define StudioCMS Plugin
 *
 * Register a StudioCMS Plugin with the StudioCMS Core.
 *
 * @param options.pkgname {string} - The Package Name of the Plugin
 * @param options.opts.pluginLabel {string} - The Label for the Plugin
 * @param options.opts.navigationLinks Array<{ text: string, slug: string }> - The Navigation Links for the Plugin
 * @param options.opts.customRendererPluginPath { string } - The Custom Renderer Plugin Path - This is used to replace the built-in Markdown Renderer. Recommended for Advanced Users.
 */
export function defineStudioCMSPlugin(options: StudioCMSPluginOptions) {
	// Extract the options
	const { pkgname, opts } = options;
	const { pluginLabel, navigationLinks, customRendererPluginPath, dashboardPageLinks } = opts;

	// Add the plugin to the StudioCMS Plugin List
	studioCMSPluginList.set(pkgname, { name: pkgname, label: pluginLabel });

	// Add the navigation links to the External Navigation Map
	if (navigationLinks) {
		for (const link of navigationLinks) {
			externalNavigation.set(`${pkgname}:${link.slug}`, { text: link.text, slug: link.slug });
		}
	}

	// Add the custom Dashboard pages to the Dashboard Page Links
	if (dashboardPageLinks) {
		// Create an array to store the Dashboard Page Links
		const dashboardPageLinksArray: SideBarLink[] = [];

		// Convert the Dashboard Page Links to the SideBarLink type
		const DashboardPluginLink: SideBarLink[] = [
			{
				id: `${pkgname}-dashboard`,
				href: '',
				text: pluginLabel,
				minPermissionLevel: 'visitor',
				icon: PLUGIN_INTEGRATION_ICON,
				type: 'dropdown',
				dropdownItems: dashboardPageLinksArray,
			},
		];

		for (const linkItem of dashboardPageLinks) {
			const { type } = linkItem;

			if (type === 'link') {
				const { icon, label, link, minRole } = linkItem;

				dashboardPageLinksArray.push({
					id: `${pkgname}-${label}`,
					href: link,
					text: label,
					minPermissionLevel: minRole,
					icon: icon,
					type: 'link',
				});
			}

			if (type === 'dropdown') {
				const { icon, label, link, minRole, type, dropdownChildren } = linkItem;

				const DropdownChildren: SideBarLink[] = [];

				if (dropdownChildren) {
					for (const childItem of dropdownChildren) {
						const { icon, label, link, minRole, type } = childItem;

						DropdownChildren.push({
							id: `${pkgname}-${label}`,
							href: link,
							text: label,
							minPermissionLevel: minRole,
							icon: icon,
							type: type,
						});
					}
				}

				dashboardPageLinksArray.push({
					id: `${pkgname}-${label}`,
					href: link,
					text: label,
					minPermissionLevel: minRole,
					icon: icon,
					type: type,
					dropdownItems: DropdownChildren,
				});
			}
		}

		// Add the Dashboard Page Links to the Dashboard Page Links Map
		dashboardPageLinksMap.set(pkgname, DashboardPluginLink);
	}

	// Add the custom renderer plugin path to the Custom Renderer Plugin Set
	if (customRendererPluginPath) {
		customRendererPlugin.add(customRendererPluginPath);
	}
}

/**
 * # StudioCMSPluginList
 *
 * A Map of StudioCMS Plugins used to register with the StudioCMS Core.
 */
export const studioCMSPluginList = new Map<string, { name: string; label: string }>();

/**
 * # External Navigation
 *
 * A Map of External Navigation Links used to register with the StudioCMS Core for usage on the Front-end Navigation bar.
 */
export const externalNavigation = new Map<string, { text: string; slug: string }>();

/**
 * # Dashboard Page Links Map
 *
 * A Map of Dashboard Page Links used to register with the StudioCMS Core for usage on the Dashboard Sidebar for displaying custom plugin pages.
 */
export const dashboardPageLinksMap = new Map<string, SideBarLink[]>();

/**
 * # Custom Renderer Plugin
 *
 * A Set of Custom Renderer Plugins used to register with the StudioCMS Core to replace the built in Markdown renderer.
 *
 * Note: This may require additional setup and configuration to work properly.
 */
export const customRendererPlugin = new Set<string>();
