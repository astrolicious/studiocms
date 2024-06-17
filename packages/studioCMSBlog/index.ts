import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";
import { studioCMSPluginList, externalNavigation } from "@astrolicious/studiocms";

// Add StudioCMS Blog to the StudioCMS Plugin List
studioCMSPluginList.set("@astrolicious/studiocms-blog", {name: "@astrolicious/studiocms-blog", label: "StudioCMS Blog"});

// Add '/blog/' to the Frontend Navigation menu
externalNavigation.set("@astrolicious/studiocms-blog/index", {text: "Blog", slug: "blog/"});

export default defineTheme({
	name: "studiocms-blog",
	schema: z.object({
		/**
		 * Title to be used in the RSS Feed.
		 */
		title: z.string().optional(),
		/**
		 * Description to be used in the RSS Feed.
		 */
		description: z.string().optional(),
	}),
}) 