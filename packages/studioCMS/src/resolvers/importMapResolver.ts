import type { AstroConfig } from "astro";
import type { StudioCMSOptions } from "../schemas";
import type { externalNavigation } from "../index";

export const ImportMapResolver = (
    imports: {
        resolvedOptions: StudioCMSOptions, 
        version: string, 
        externalNavigation: typeof externalNavigation,
        astroConfig: AstroConfig, 
        virtualComponentMap: string, 
        virtualHelperMap: string
    }
) => {

    const { resolvedOptions, version, externalNavigation, astroConfig, virtualComponentMap, virtualHelperMap } = imports

    return { 
        'virtual:studiocms/config': `export default ${JSON.stringify(resolvedOptions)}`,
        'virtual:studiocms/version': `export default '${version}'`,
        'virtual:studiocms/_nav': `export const externalNav = new Map(${JSON.stringify(Array.from(externalNavigation.entries()))});`,
        'virtual:studiocms/astromdremarkConfig': `export default ${JSON.stringify(astroConfig.markdown)}`,
        'studiocms:components': virtualComponentMap,
        'studiocms:helpers': virtualHelperMap,
    }
}
