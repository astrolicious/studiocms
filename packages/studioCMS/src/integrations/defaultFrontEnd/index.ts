import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";

export default defineTheme({
	name: "@astrolicious/studiocms-defaultfrontend",
	schema: z.object({
	}),
    integrations: []
});