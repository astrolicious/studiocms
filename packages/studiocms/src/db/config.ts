/// <reference types="@astrojs/db" />
import { NOW, column, defineDb, defineTable } from 'astro:db';

// Users Table
export const StudioCMSUsers = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		url: column.text({ optional: true }),
		name: column.text(),
		email: column.text({ unique: true, optional: true }),
		avatar: column.text({ optional: true }),
		githubId: column.number({ unique: true, optional: true }),
		githubURL: column.text({ optional: true }),
		discordId: column.text({ unique: true, optional: true }),
		googleId: column.text({ unique: true, optional: true }),
		auth0Id: column.text({ unique: true, optional: true }),
		username: column.text(),
		password: column.text({ optional: true }),
		updatedAt: column.date({ default: NOW, optional: true }),
		createdAt: column.date({ default: NOW, optional: true }),
	},
});

// Login Sessions Table
export const StudioCMSSessionTable = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		userId: column.text({ references: () => StudioCMSUsers.columns.id, optional: false }),
		expiresAt: column.date(),
	},
});

// Page Data Table
export const StudioCMSPageData = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		package: column.text({ default: 'studiocms' }),
		title: column.text(),
		description: column.text(),
		showOnNav: column.boolean({ default: false }),
		publishedAt: column.date({ default: NOW }),
		updatedAt: column.date({ optional: true }),
		slug: column.text(),
		contentLang: column.text({ default: 'default' }),
		heroImage: column.text({
			default:
				'https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		}),
	},
});

// Page Content Table
export const StudioCMSPageContent = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		contentId: column.text({ references: () => StudioCMSPageData.columns.id }),
		contentLang: column.text({ default: 'default' }),
		content: column.text({ multiline: true, optional: true }),
	},
});

// Site Config Table
export const StudioCMSSiteConfig = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		title: column.text(),
		description: column.text(),
	},
});

// Permissions Table
export const StudioCMSPermissions = defineTable({
	columns: {
		username: column.text(),
		rank: column.text(),
	},
});

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
