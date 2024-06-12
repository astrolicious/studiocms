import type { VirtResolver } from ".";
import { studioCMSPluginList } from "..";

export const MakeVirtualImportMaps = (virtResolver: VirtResolver) => {
    
	// Virtual Components
	const defaultNamedComponents = [
		{ title: "CImage", import: virtResolver.CImage },
		{ title: "FormattedDate", import: virtResolver.FormattedDate },
		{ title: "StudioCMSRenderer", import: virtResolver.StudioCMSRenderer },
		{ title: "Navigation", import: virtResolver.NavigationBar },
		{ title: "Avatar", import: virtResolver.Avatar },
		{ title: "FrontLayout", import: virtResolver.defaultLayout },
	];

	// Virtual Component Map
	let virtualComponentMap = ''
	defaultNamedComponents.map(({ title, import: path }) => {
		virtualComponentMap += `export { default as ${title} } from '${path}';\n`
	})

	virtualComponentMap += `export * from '${virtResolver.contentHelper}';`;

	// Virtual Helpers
	const defaultNamedHelpers = [
		{ title: 'authHelper', import: virtResolver.AuthHelper },
    	{ title: 'urlGenFactory', import: virtResolver.UrlGenHelper },
	]

	const miscNamedHelpers = [
		{ import: virtResolver.StudioCMSLocalsMap },
		{ import: virtResolver.StudioCMSDBTypeHelpers },
		{ import: virtResolver.textFormatterHelper },
	]

	// Virtual Helper Map
	let virtualHelperMap = ''

	defaultNamedHelpers.map(({ title, import: path }) => {
		virtualHelperMap += `export { default as ${title} } from '${path}';\n`
	})

	miscNamedHelpers.map(({ import: path }) => {
		virtualHelperMap += `export * from '${path}';\n`
	})
    
	virtualHelperMap += `export const pluginList = new Map(${JSON.stringify(Array.from(studioCMSPluginList.entries()))});`;

    return {
        virtualComponentMap, virtualHelperMap
    }
}
