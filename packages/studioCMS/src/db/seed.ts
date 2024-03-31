// @ts-expect-error - This is a missing type definition for the `astro:db` import since its a virtual module during Astro Runtime
import { db } from 'astro:db';
import { asDrizzleTable } from '@astrojs/db/utils';
import { Blog, Pages } from './tables';

const LOREM_IPSUM =
	'## Hello World \nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default async function () {
	const tsPages = asDrizzleTable('Pages', Pages);
	const tsBlog = asDrizzleTable('Blog', Blog);

	await db.insert(tsPages).values([
		{
			title: 'Home',
			slug: 'index',
			description: 'Index page',
			heroImage:
				'https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			content: LOREM_IPSUM,
		},
		{
			title: 'About',
			slug: 'about',
			description: 'About page',
			heroImage:
				'https://images.unsplash.com/photo-1661174585122-83a2909163ad?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			content: LOREM_IPSUM,
		},
	]);

	await db.insert(tsBlog).values([
		{
			title: 'Hello, World!',
			slug: 'hello-world',
			description: 'Lorem ipsum dolor sit amet',
			publishedAt: new Date('2024-03-12T07:00:00Z'),
			heroImage:
				'https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			content: LOREM_IPSUM,
		},
	]);
}
