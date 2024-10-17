import type { APIContext, APIRoute } from 'astro';
import { importPagesFromWPAPI, importPostsFromWPAPI } from '../utils/wp-api';

export const POST: APIRoute = async ({ request }: APIContext) => {
	const data = await request.formData();

	const url = data.get('url');
	const type = data.get('type');
	const useBlogPlugin = data.get('useBlogPlugin');

	console.log('data', url, type, useBlogPlugin);

	if (!url || !type) {
		return new Response(null, {
			status: 400,
			statusText: 'Bad Request',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
			},
		});
	}

	if (typeof url !== 'string' || typeof type !== 'string' || typeof useBlogPlugin !== 'string') {
		return new Response(null, {
			status: 400,
			statusText: 'Bad Request',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
			},
		});
	}

	switch (type) {
		case 'pages':
			await importPagesFromWPAPI(url);
			break;
		case 'posts':
			await importPostsFromWPAPI(url, useBlogPlugin === 'true');
			break;
		default:
			throw new Error('Invalid import type');
	}

	return new Response(null, {
		status: 200,
		statusText: 'success',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Headers': '*',
		},
	});
};
