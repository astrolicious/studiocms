import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import { presetDaisy } from '@matthiesenxyz/unocss-preset-daisyui';
import UnoCSSAstroIntegration from '@unocss/astro';
import type { AstroIntegrationConfig } from '@unocss/astro';
import type { AstroIntegration } from 'astro';
import {
	presetIcons,
	presetTypography,
	presetUno,
	presetWebFonts,
	presetWind,
	transformerDirectives,
} from 'unocss';
import type { UserConfigDefaults } from 'unocss';
import type { IconsOptions } from 'unocss/preset-icons';
import type { DarkModeSelectors } from 'unocss/preset-mini';
import type { StudioCMSOptions } from './schemas';

export { transformerDirectives, FileSystemIconLoader };

const darkModeSelector: DarkModeSelectors = {
	dark: '[data-theme="dark"]',
};

export const studiocssPreset = (opts: {
	daisy: {
		themes: string[];
		darkTheme: string;
	};
	icons: IconsOptions['collections'] | undefined;
}) => {
	return [
		presetUno({
			dark: darkModeSelector,
		}),
		presetWind({
			dark: darkModeSelector,
		}),
		presetDaisy({
			themes: opts.daisy.themes,
			darkTheme: opts.daisy.darkTheme,
		}),
		presetTypography(),
		presetIcons({
			collections: {
				...opts.icons,
			},
		}),
		presetWebFonts({
			provider: 'google',
			fonts: {
				// Required Fonts for Google Icons
				sans: 'Roboto',
				mono: ['Fira Code', 'Fira Mono:400,700'],
			},
		}),
	];
};

export function StudioUnoCSS<Theme extends object>(
	options?: AstroIntegrationConfig<Theme>,
	defaults?: UserConfigDefaults
) {
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
export function studioCMSUnoCSSIntegration(opts: {
	options: StudioCMSOptions;
	icons: IconsOptions['collections'] | undefined;
}) {
	const {
		dashboardConfig: { UnoCSSConfigOverride },
	} = opts.options;
	const {
		presetsConfig: { presetDaisyUI },
	} = UnoCSSConfigOverride;

	return StudioUnoCSS({
		configFile: false,
		injectReset: UnoCSSConfigOverride.injectReset,
		injectEntry: UnoCSSConfigOverride.injectEntry,
		transformers: [transformerDirectives()],
		presets: studiocssPreset({
			daisy: {
				themes: presetDaisyUI.themes,
				darkTheme: presetDaisyUI.darkTheme,
			},
			icons: opts.icons,
		}),
	});
}
