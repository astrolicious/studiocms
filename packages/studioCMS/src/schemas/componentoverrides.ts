import { z } from "astro/zod";

export const overridesSchema = z.object({
    /**
     * Allows overriding the default content renderer component used in StudioCMS for rendering markdown content
     * 
     * *Tip: This is relative to the project root*
     * 
     * @example './src/components/MyCustomRenderer.astro'
     */
    RendererOverride: z.string().optional(),
    /**
     * Allows the user to override the default image component used in StudioCMS for rendering images.
     */
    CustomImageOverride: z.string().optional(),
    /**
     * Allows the user to override the default formatted date component used in StudioCMS for rendering dates.
     */
    FormattedDateOverride: z.string().optional(),
}).optional().default({});