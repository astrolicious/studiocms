import { createResolver } from "astro-integration-kit";
import { customRendererPlugin, externalNavigation, studioCMSPluginList } from "../plugintools";
import { DTSResolver } from "./studiocms-dts";
import type { ResolverOpts, ResolverResponse, VirtualResolver } from "./types";

const { resolve } = createResolver(import.meta.url)

export const vResolver = ( opts: ResolverOpts ): ResolverResponse => {

    // Destructure Options
    const { overrides, imports } = opts;

    // Create Virtual Resolver
    let customRenderPlugin: string[] = []
    if (customRendererPlugin) {
        customRenderPlugin = Array.from(customRendererPlugin)
    }

    const StudioCMSRendererResolver = () => {
        let rendererPath: string
        if (customRendererPlugin.size > 0 && customRenderPlugin[0]) {
            rendererPath = customRenderPlugin[0]
            return rendererPath
        }
        return resolve('../components/exports/StudioCMSRenderer.astro');
    }

    let customImageResolved: string

    if (overrides.CustomImageOverride) {
        customImageResolved = overrides.CustomImageOverride
    } else {
        customImageResolved = resolve('../components/exports/CImage.astro')
    }

    let formattedDateResolved: string

    if (overrides.FormattedDateOverride) {
        formattedDateResolved = overrides.FormattedDateOverride
    } else {
        formattedDateResolved = resolve('../components/exports/FormattedDate.astro')
    }

    const virtualResolver: VirtualResolver = {
        CImage: customImageResolved,
        FormattedDate: formattedDateResolved,
        StudioCMSRenderer: StudioCMSRendererResolver(),
        AuthHelper: resolve('../utils/authhelper.ts'),
        StudioCMSLocalsMap: resolve('../schemas/locals.ts'),
        StudioCMSDBTypeHelpers: resolve('../schemas/dbtypehelpers.ts'),
        UrlGenHelper: resolve('../utils/urlGen.ts'),
        textFormatterHelper: resolve('../utils/textFormatter.ts'),
        contentHelper: resolve('../utils/contentHelper.ts'),
        NavigationBar: resolve('../components/exports/Navigation.astro'),
        Avatar: resolve('../components/exports/Avatar.astro'),
        defaultLayout: resolve('../defaultRoutes/components/Layout.astro'),
        headDefaults: resolve('../components/exports/headDefaults.ts'),
        Genericheader: resolve('../components/exports/GenericHeader.astro'),
    }

    // Create Virtual Import Maps

    //-// Virtual Components
    const NamedComponents = [
		{ title: "CImage", import: virtualResolver.CImage },
		{ title: "FormattedDate", import: virtualResolver.FormattedDate },
		{ title: "StudioCMSRenderer", import: virtualResolver.StudioCMSRenderer },
		{ title: "Navigation", import: virtualResolver.NavigationBar },
		{ title: "Avatar", import: virtualResolver.Avatar },
		{ title: "FrontLayout", import: virtualResolver.defaultLayout },
        { title: "GenericHeader", import: virtualResolver.Genericheader },
    ]

    const MiscComponents = [
        { import: virtualResolver.contentHelper },
        { import: virtualResolver.headDefaults },
    ]

    let virtualComponentMap = ''
    
    NamedComponents.map(({ title, import: path }) => {
        virtualComponentMap += `export { default as ${title} } from '${path}';\n`
    })

    MiscComponents.map(({ import: path }) => {
        virtualComponentMap += `export * from '${path}';\n`
    })

    //-// Virtual Helpers
    const NamedHelpers = [
        { title: 'authHelper', import: virtualResolver.AuthHelper },
        { title: 'urlGenFactory', import: virtualResolver.UrlGenHelper },
    ]

    const MiscHelpers = [
        { import: virtualResolver.StudioCMSLocalsMap },
        { import: virtualResolver.StudioCMSDBTypeHelpers },
        { import: virtualResolver.textFormatterHelper },
    ]

    let virtualHelperMap = ''

    NamedHelpers.map(({ title, import: path }) => {
        virtualHelperMap += `export { default as ${title} } from '${path}';\n`
    })

    MiscHelpers.map(({ import: path }) => {
        virtualHelperMap += `export * from '${path}';\n`
    })

    virtualHelperMap += `export const pluginList = new Map(${JSON.stringify(Array.from(studioCMSPluginList.entries()))});`;

    //-// Build Virtual Import Map
    const { resolvedOptions, version, astroConfig: { markdown: astroMarkdown } } = imports;

    const importMap: ResolverResponse['virtualImportMap'] = {
        'virtual:studiocms/config': `export default ${JSON.stringify(resolvedOptions)}`,
        'virtual:studiocms/version': `export default '${version}'`,
        'virtual:studiocms/_nav': `export const externalNav = new Map(${JSON.stringify(Array.from(externalNavigation.entries()))});`,
        'virtual:studiocms/astromdremarkConfig': `export default ${JSON.stringify(astroMarkdown)}`,
        'studiocms:components': virtualComponentMap,
        'studiocms:helpers': virtualHelperMap,
    }

    return {
        virtualImportMap: importMap,
        dtsFile: DTSResolver(virtualResolver),
    }
}