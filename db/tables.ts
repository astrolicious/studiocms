import { defineTable, column, NOW } from "astro:db";

export const Session = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		userId: column.number({ references: () => User.columns.id }),
		expiresAt: column.number(),
	},
});

export const User = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		url: column.text({ optional: true }),
		name: column.text(),
		email: column.text({ unique: true, optional: true }),
		avatar: column.text({ optional: true }),
		githubId: column.number({ unique: true }),
		githubURL: column.text({ optional: true }),
		username: column.text(),
		updatedAt: column.date({ default: NOW, nullable: true }),
		createdAt: column.date({ default: NOW, nullable: true }),
	},
});

export const Admins = defineTable({
	columns: {
		GitHubUsername: column.text(),
	},
});

export const Blog = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		title: column.text(),
		description: column.text(),
		slug: column.text(),
		publishedAt: column.date({ default: NOW }),
		updatedAt: column.date({ optional: true }),
		heroImage: column.text({
			default: '/blog-placeholder-1.jpg',
		}),
		content: column.text({ multiline: true }),
	},
});

export const Pages = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		title: column.text(),
		description: column.text(),
		publishedAt: column.date({ default: NOW }),
		slug: column.text(),
		heroImage: column.text({
			default: '/blog-placeholder-1.jpg',
		}),
		content: column.text({ multiline: true }),
	},
});