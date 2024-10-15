import { cachedFetch } from '../util-server';

export interface Contributor {
	login: string;
	id: number;
	contributions: number;
	avatar_url?: string;
}

interface Commit {
	author: {
		login: string;
		id: number;
	};
	commit: {
		message: string;
	};
}

const printError = (e: Error) =>
	console.warn(`[error]  /src/util/getContributors.ts\n         ${e?.message ?? e}`);

async function recursiveFetch(endpoint: string, page = 1) {
	try {
		const queryParam = endpoint.includes('?') ? '&' : '?';
		const pageSize = 100;
		const url = `https://api.github.com/${endpoint}${queryParam}per_page=${pageSize}&page=${page}`;

		const token = import.meta.env.PUBLIC_GITHUB_TOKEN;

		const res = await cachedFetch(
			url,
			{
				method: 'GET',
				headers: {
					Authorization: token && `Basic ${Buffer.from(token, 'binary').toString('base64')}`,
					'User-Agent': 'astro-docs/1.0',
				},
			},
			{ duration: '15m' }
		);

		const data = await res.json();

		if (!res.ok) {
			throw new Error(
				`Request to fetch endpoint failed. Reason: ${res.statusText}
         Message: ${data?.message}`
			);
		}

		// Fetch more data recursively if there are more than GitHub’s per-page response limit.
		if (data.length === pageSize) {
			const rest = await recursiveFetch(endpoint, page + 1);
			data.push(...rest);
		}

		return data;
	} catch (e) {
		printError(e as Error);
		return [];
	}
}

export async function getAllContributors(repo: string) {
	const endpoint = `repos/${repo}/contributors`;
	const contributors: Contributor[] = await recursiveFetch(endpoint);

	return contributors;
}
