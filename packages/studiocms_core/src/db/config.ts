/// <reference types="@astrojs/db" />
import { defineDb } from 'astro:db';
import { asDrizzleTable } from '@astrojs/db/utils';
import {
	StudioCMSPageContent,
	StudioCMSPageData,
	StudioCMSPermissions,
	StudioCMSSessionTable,
	StudioCMSSiteConfig,
	StudioCMSUsers,
} from './tables';

// Export the Database Configuration
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

/** Exported TypeSafe Tables for use in StudioCMS Integrations */
export const tsPageContent = asDrizzleTable('StudioCMSPageContent', StudioCMSPageContent);
/** Exported TypeSafe Tables for use in StudioCMS Integrations */
export const tsPageData = asDrizzleTable('StudioCMSPageData', StudioCMSPageData);
/** Exported TypeSafe Tables for use in StudioCMS Integrations */
export const tsPermissions = asDrizzleTable('StudioCMSPermissions', StudioCMSPermissions);
/** Exported TypeSafe Tables for use in StudioCMS Integrations */
export const tsSessionTable = asDrizzleTable('StudioCMSSessionTable', StudioCMSSessionTable);
/** Exported TypeSafe Tables for use in StudioCMS Integrations */
export const tsSiteConfig = asDrizzleTable('StudioCMSSiteConfig', StudioCMSSiteConfig);
/** Exported TypeSafe Tables for use in StudioCMS Integrations */
export const tsUsers = asDrizzleTable('StudioCMSUsers', StudioCMSUsers);
