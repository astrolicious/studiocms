import { z } from "astro/zod";
import { imageServiceSchema } from "../../schemas/imageService";

export const ImageHandlerOptionsSchema = z.object({
    ImageServiceConfig: imageServiceSchema,
    verbose: z.boolean().optional().default(false),
}).default({})