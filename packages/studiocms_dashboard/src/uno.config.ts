import { presetDaisy } from '@matthiesenxyz/unocss-preset-daisyui';
import {
	defineConfig,
	presetTypography,
	presetUno,
	presetWebFonts,
	presetWind,
	transformerDirectives,
} from 'unocss';
import type { DarkModeSelectors } from 'unocss/preset-mini';

const darkModeSelector: DarkModeSelectors = {
	dark: '[data-theme="dark"]',
};

export default defineConfig({
	transformers: [transformerDirectives()],
	presets: [
		presetUno({
			dark: darkModeSelector,
		}),
		presetWind({
			dark: darkModeSelector,
		}),
		presetDaisy({
			themes: ['light', 'dark'],
			darkTheme: 'dark',
		}),
		presetTypography(),
		presetWebFonts({
			provider: 'google',
			fonts: {
				// Required Fonts for Google Icons
				sans: 'Roboto',
				mono: ['Fira Code', 'Fira Mono:400,700'],
			},
		}),
	],
});
