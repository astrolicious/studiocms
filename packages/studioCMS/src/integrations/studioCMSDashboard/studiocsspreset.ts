import { presetDaisy } from '@yangyang20240403/unocss-preset-daisyui'
import { presetTypography, presetUno, presetWebFonts, presetIcons, presetWind, type Preset, type UserConfigDefaults, transformerDirectives } from 'unocss'
import type { IconsOptions } from 'unocss/preset-icons'
import type { WebFontsOptions } from 'unocss/preset-web-fonts'
import type { Theme } from 'unocss/preset-wind'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import UnoCSSAstroIntegration, { type AstroIntegrationConfig } from "@unocss/astro";
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import type { AstroIntegration } from 'astro'
import type { StudioCMSOptions } from '../../schemas'

export { transformerDirectives, FileSystemIconLoader }

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

export function StudioUnoCSS<Theme extends object>(options?: AstroIntegrationConfig<Theme>, defaults?: UserConfigDefaults) {
    return UnoCSSAstroIntegration(options, defaults) as unknown as AstroIntegration;
}

/**
 * StudioCMS UnoCSS Integration - Preconfigured UnoCSS Integration for StudioCMS
 * 
 * @param opts.options - StudioCMS Passed Through Options
 * @param opts.icons - Icon collection loaded from file system
 * 
 * @returns UnoCSS Astro Integration configured for StudioCMS
 */
export function studioCMSUnoCSSIntegration(
    opts: {
        options: StudioCMSOptions,
        icons: {
            collections: IconsOptions['collections'] | undefined
        },
    }
) {
    const { dashboardConfig: { UnoCSSConfigOverride } } = opts.options;
    const { presetsConfig: { presetDaisyUI } } = UnoCSSConfigOverride;

    return StudioUnoCSS({
        configFile: false,
        injectReset: UnoCSSConfigOverride.injectReset,
        injectEntry: UnoCSSConfigOverride.injectEntry,
        transformers: [ transformerDirectives() ],
        presets: studiocssPreset({
            daisy: { 
                themes: presetDaisyUI.themes, 
                darkTheme: presetDaisyUI.darkTheme 
            },
            icons: opts.icons,
            fonts: {
                provider: 'google',
                fonts: {
                    // Required Fonts for Google Icons
                    sans: 'Roboto',
                    mono: ['Fira Code', 'Fira Mono:400,700'],
                },
            },
        })
    })
}