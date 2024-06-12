import type { AstroConfig } from "astro";
import type { StudioCMSOptions } from "../schemas";
import type { externalNavigation } from "../index";

export const ImportMapResolver = (
    imports: {
        mergedOptions: StudioCMSOptions, 
        version: string, 
        externalNavigation: typeof externalNavigation,
        astroConfig: AstroConfig, 
        virtualComponentMap: string, 
        virtualHelperMap: string
    }
) => {

    const { mergedOptions, version, externalNavigation, astroConfig, virtualComponentMap, virtualHelperMap } = imports

    return { 
        'virtual:studiocms/config': `export default ${JSON.stringify(mergedOptions)}`,
        'virtual:studiocms/version': `export default '${version}'`,
        'virtual:studiocms/_nav': `export const externalNav = new Map(${JSON.stringify(Array.from(externalNavigation.entries()))});`,
        'virtual:studiocms/astromdremarkConfig': `export default ${JSON.stringify(astroConfig.markdown)}`,
        'studiocms:components': virtualComponentMap,
        'studiocms:helpers': virtualHelperMap,
    }
}
