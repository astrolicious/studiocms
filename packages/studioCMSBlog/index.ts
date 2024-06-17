import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";
import { studioCMSPluginList, externalNavigation } from "@astrolicious/studiocms";

studioCMSPluginList.set("@astrolicious/studiocms-blog", {name: "@astrolicious/studiocms-blog", label: "StudioCMS Blog"});

externalNavigation.set("@astrolicious/studiocms-blog/index", {text: "Blog", slug: "blog/"});

export default defineTheme({
	name: "studiocms-blog",
	schema: z.object({
		description: z.string().optional(),
	}),
}) 