import { z } from "astro/zod";

export const unocssDaisyUISchema = z.object({
    /**
     * OPTIONAL - This allows the user to use any of the available DaisyUI themes
     * 
     * @default ['light', 'dark']
     */
    themes: z.array(z.string()).optional().default(['light', 'dark']),
    /**
     * OPTIONAL - This allows the user to set the default light theme
     * 
     * @default 'light'
     */
    lightTheme: z.string().optional().default('light'),
    /**
     * OPTIONAL - This allows the user to set the default dark theme
     * 
     * @default 'dark'
     */
    darkTheme: z.string().optional().default('dark'),
}).optional().default({})

export const unocssPresetsSchema = z.object({
    /**
     * OPTIONAL - This allows the user to enable or disable the UnoCSS DaisyUI Preset
     */
    presetDaisyUI: unocssDaisyUISchema,
}).optional().default({})

export const unocssConfigSchema = z.object({
    /**
     * OPTIONAL - This allows the user to enable or disable the UnoCSS Default Reset import
     * 
     * If you would like to use our UnoCSS configuration with our front-end you can enable this option to import the default reset styles or use the example from the code snippet below to import the reset styles into your Base Layout/header.
     * 
     * ```tsx
     * ---
     * import '@unocss/reset/tailwind.css';
     * ---
     * ```
     * @default false
     * The default is false to prevent the dashboard from injecting the reset styles into your project.
     */
    injectReset: z.boolean().optional().default(false),
    /**
     * OPTIONAL - This allows the user to enable or disable the UnoCSS Default Entry import
     * 
     * If you would like to use our UnoCSS configuration with our front-end you can enable this option to import the default entry styles or use the example from the code snippet below to import the entry styles into your Base Layout/header.
     * 
     * ```tsx
     * ---
     * import 'uno.css';
     * ---
     * ```
     * @default false
     * The default is false to prevent the dashboard from injecting the entry styles into your project.
     */
    injectEntry: z.boolean().optional().default(false),
    /**
     * Allows the user to modify the included UnoCSS Presets
     */
    presetsConfig: unocssPresetsSchema,
}).optional().default({});