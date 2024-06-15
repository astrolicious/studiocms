import { presetDaisy } from '@yangyang20240403/unocss-preset-daisyui'
import { presetTypography, presetUno, presetWebFonts, presetIcons, presetWind, type Preset, type UserConfigDefaults } from 'unocss'
import type { IconsOptions } from 'unocss/preset-icons'
import type { WebFontsOptions } from 'unocss/preset-web-fonts'
import type { Theme } from 'unocss/preset-wind'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export const studiocssPreset = (
    opts: {
        daisy: {
            themes: string[],
            darkTheme: string,
        },
        icons: {
            collections: IconsOptions['collections'] | undefined
        },
        fonts: WebFontsOptions | undefined
    }
) => {
    return [
        presetUno(),
        presetWind() as Preset<Theme>, 
        presetDaisy({
            themes: opts.daisy.themes,
            darkTheme: opts.daisy.darkTheme,
        }),
        presetTypography(),
        presetIcons({
            ...opts.icons.collections,
        }),
        presetScrollbar(),
        presetWebFonts(opts.fonts),
    ]
}

import { transformerDirectives } from "unocss";
import UnoCSSAstroIntegration, { type AstroIntegrationConfig } from "@unocss/astro";
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import type { AstroIntegration } from 'astro'

function StudioUnoCSS<Theme extends object>(options?: AstroIntegrationConfig<Theme>, defaults?: UserConfigDefaults) {
    return UnoCSSAstroIntegration(options, defaults) as unknown as AstroIntegration;
}

export { transformerDirectives, StudioUnoCSS, FileSystemIconLoader }