import type { AstroConfig } from "astro";
import type { StudioCMSOptions } from "../schemas";

export type ResolverOpts = {
    overrides: {
        CustomImageOverride: string | undefined,
        FormattedDateOverride: string | undefined,
    },
    imports: {
        resolvedOptions: StudioCMSOptions, 
        version: string,
        astroConfig: AstroConfig,
    }
}

export type ResolverResponse = {
    virtualImportMap: Record<string, string>,
    dtsFile: string,
}

export type VirtualResolver = {
    CustomImage: string;
    FormattedDate: string;
    StudioCMSRenderer: string;
    ContentRenderer: string;
    AuthHelper: string;
    StudioCMSLocalsMap: string;
    StudioCMSDBTypeHelpers: string;
    UrlGenHelper: string;
    textFormatterHelper: string;
    contentHelper: string;
    NavigationBar: string;
    Avatar: string;
    defaultLayout: string;
    headDefaults: string;
    Genericheader: string;
    pathGenerators: string;
}