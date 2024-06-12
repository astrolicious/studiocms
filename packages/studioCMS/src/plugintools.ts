
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