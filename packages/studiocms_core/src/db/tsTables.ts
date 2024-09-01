import { asDrizzleTable } from '@astrojs/db/utils';
import {
	StudioCMSPageContent,
	StudioCMSPageData,
	StudioCMSPermissions,
	StudioCMSSessionTable,
	StudioCMSSiteConfig,
	StudioCMSUsers,
} from './tables';

/**
 * # StudioCMS - Page Content Table
 * @description Exported TypeSafe Table definition for use in StudioCMS Integrations
 */
export const tsPageContent = asDrizzleTable('StudioCMSPageContent', StudioCMSPageContent);

/**
 * # StudioCMS - Page Data Table
 * @description Exported TypeSafe Table definition for use in StudioCMS Integrations
 */
export const tsPageData = asDrizzleTable('StudioCMSPageData', StudioCMSPageData);

/**
 * # StudioCMS - Permissions Table
 * @description Exported TypeSafe Table definition for use in StudioCMS Integrations
 */
export const tsPermissions = asDrizzleTable('StudioCMSPermissions', StudioCMSPermissions);

/**
 * # StudioCMS - Session Table
 * @description Exported TypeSafe Table definition for use in StudioCMS Integrations
 */
export const tsSessionTable = asDrizzleTable('StudioCMSSessionTable', StudioCMSSessionTable);

/**
 * # StudioCMS - Site Config Table
 * @description Exported TypeSafe Table definition for use in StudioCMS Integrations
 */
export const tsSiteConfig = asDrizzleTable('StudioCMSSiteConfig', StudioCMSSiteConfig);

/**
 * # StudioCMS - Users Table
 * @description Exported TypeSafe Table definition for use in StudioCMS Integrations
 */
export const tsUsers = asDrizzleTable('StudioCMSUsers', StudioCMSUsers);
