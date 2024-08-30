import { defineDb } from 'astro:db';
import { PageContent, PageData, Permissions, SiteConfig, User, sessionTable } from './tables';

// https://astro.build/db/config
export default defineDb({
	tables: {
		SiteConfig,
		sessionTable,
		User,
		Permissions,
		PageData,
		PageContent,
	},
});
