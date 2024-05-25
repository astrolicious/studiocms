import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";
import { studioCMSPluginList } from "@astrolicious/studiocms"

studioCMSPluginList.set("@astrolicious/studiocms-blog", {name: "@astrolicious/studiocms-blog", label: "StudioCMS Blog"});

export default defineTheme({
	name: "@astrolicious/studiocms-blog",
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
	}),
    imports: {
    },
});