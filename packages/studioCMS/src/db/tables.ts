// @ts-expect-error - This is a missing type definition for the `astro:db` import since its a virtual module during Astro Runtime
import { NOW, column, defineTable, sql } from 'astro:db';

export const Session = defineTable({
	columns: {
		id: column.text({ primaryKey: true, nullable: false }),
		userId: column.text({ references: () => User.columns.id, nullable: false }),
		expiresAt: column.number({ nullable: false }),
	},
});

export const User = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		url: column.text({ optional: true }),
		name: column.text(),
		email: column.text({ unique: true, optional: true }),
		avatar: column.text({ optional: true }),
		githubId: column.number({ unique: true, optional: true, nullable: true }),
		githubURL: column.text({ optional: true }),
		discordId: column.text({ unique: true, optional: true, nullable: true }),
		googleId: column.text({ unique: true, optional: true, nullable: true }),
		auth0Id: column.text({ unique: true, optional: true, nullable: true }),
		username: column.text(),
		password: column.text({ optional: true }),
		updatedAt: column.date({ default: NOW, nullable: true }),
		createdAt: column.date({ default: NOW, nullable: true }),
	},
});

export const PageData = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		package: column.text({ default: '@astrolicious/studiocms' }),
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

export const PageContent = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		contentId: column.text({ references: () => PageData.columns.id }),
		contentLang: column.text({ default: 'default' }),
		content: column.text({ multiline: true, optional: true }),
	},
});


export const SiteConfig = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		title: column.text(),
		description: column.text(),
	},
});

export const Permissions = defineTable({
	columns: {
		username: column.text(),
		rank: column.text(),
	},
});
