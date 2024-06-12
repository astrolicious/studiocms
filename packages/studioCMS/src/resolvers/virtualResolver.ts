import { createResolver } from "astro-integration-kit"
import { customRendererPlugin } from "../index";

const { resolve } = createResolver(import.meta.url)

export const VirtualResolver = ( 
    CustomImagePath: string|undefined,
    FormattedDatePath: string|undefined,
 ) => {

    let ROP: string[] = []
    if (customRendererPlugin) {
        ROP = Array.from(customRendererPlugin)
    }
    
    const StudioCMSRendererResolver = () => {
        let RendererPath: string
        if (customRendererPlugin.size > 0 && ROP[0]) {
            RendererPath = ROP[0]
            return RendererPath
        }
        return resolve('../components/exports/StudioCMSRenderer.astro');
    }
    
    let CustomImageResolved: string

    if (CustomImagePath) {
        CustomImageResolved = CustomImagePath
    } else {
        CustomImageResolved = resolve('../components/exports/CImage.astro')
    }

    let FormattedDateResolved: string

    if (FormattedDatePath) {
        FormattedDateResolved = FormattedDatePath
    } else {
        FormattedDateResolved = resolve('../components/exports/FormattedDate.astro')
    }

    return {
        CImage: CustomImageResolved,
        FormattedDate: FormattedDateResolved,
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
    }
}
