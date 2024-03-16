import { Admins, Blog, db } from 'astro:db';

const LOREM_IPSUM =
	'## It\'s Alive! \nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default async function seed() {
	await db.insert(Blog).values([
		{
			title: 'Hello, World!',
			slug: 'hello-world',
			description: 'Lorem ipsum dolor sit amet',
			publishedAt: new Date('2024-03-12T07:00:00Z'),
			heroImage: 'cld-sample-2',
			content: LOREM_IPSUM,
		},
	]);
	await db.insert(Admins).values([
		{ GitHubUsername: 'Adammatthiesen' },
	]);
}
