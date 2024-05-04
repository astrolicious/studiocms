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
}).optional().default({});