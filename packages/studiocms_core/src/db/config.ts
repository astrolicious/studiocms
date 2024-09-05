/// <reference types="@astrojs/db" />
import { defineDb } from 'astro:db';
import {
	StudioCMSPageContent,
	StudioCMSPageData,
	StudioCMSPermissions,
	StudioCMSSessionTable,
	StudioCMSSiteConfig,
	StudioCMSUsers,
} from './tables';

// Export the Database Configuration for StudioCMS
export default defineDb({
	tables: {
		StudioCMSPageContent,
		StudioCMSPageData,
		StudioCMSPermissions,
		StudioCMSSessionTable,
		StudioCMSSiteConfig,
		StudioCMSUsers,
	},
});
