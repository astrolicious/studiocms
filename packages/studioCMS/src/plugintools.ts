
export type StudioCMSPluginOptions = {
    /**
     * The Package Name of the Plugin
     */
    pkgname: string,
    /**
     * The Options for the Plugin
     */
    opts: {
        /**
         * The Label for the Plugin used in the Dashboard
         */
        pluginLabel: string,
        /**
         * The Front-end Navigation Links for the Plugin
         */
        navigationLinks?: {
            text: string,
            slug: string
        }[],
        /**
         * The Custom Renderer Plugin Path - This is used to replace the built-in Markdown Renderer. Recommended for Advanced Users.
         */
        customRendererPluginPath?: string;
    }
}

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
    const { pkgname, opts } = options;
    const { pluginLabel, navigationLinks, customRendererPluginPath } = opts;
    studioCMSPluginList.set(pkgname, { name: pkgname, label: pluginLabel });
    if (navigationLinks) {
        navigationLinks.forEach((link) => {
            externalNavigation.set(pkgname+":"+link.slug, { text: link.text, slug: link.slug });
        });
    }
    if (customRendererPluginPath) {
        customRendererPlugin.add(customRendererPluginPath);
    }
}

/** 
 * # StudioCMSPluginList
 * 
 * A Map of StudioCMS Plugins used to register with the StudioCMS Core.
 */
export const studioCMSPluginList = new Map<string, { name: string, label: string }>();

/** 
 * # External Navigation
 * 
 * A Map of External Navigation Links used to register with the StudioCMS Core for usage on the Front-end Navigation bar.
 */
export const externalNavigation = new Map<string, { text: string, slug: string }>();

/**
 * # Custom Renderer Plugin
 * 
 * A Set of Custom Renderer Plugins used to register with the StudioCMS Core to replace the built in Markdown renderer.
 * 
 * Note: This may require additional setup and configuration to work properly.
 */
export const customRendererPlugin = new Set<string>();