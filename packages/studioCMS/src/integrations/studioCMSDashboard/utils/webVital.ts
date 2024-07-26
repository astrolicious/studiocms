import { AstrojsWebVitals_Metric, db } from 'astro:db';

export type WebVitalsResponseItem = {
	id: string;
	pathname: string;
	route: string;
	name: string;
	value: number;
	rating: string;
	timestamp: Date;
};

export async function getWebVitals(): Promise<WebVitalsResponseItem[]> {
	const webVitals: WebVitalsResponseItem[] = await db
		.select()
		.from(AstrojsWebVitals_Metric)
		.catch(() => {
			return [] as WebVitalsResponseItem[];
		});
	if (!webVitals) {
		return [] as WebVitalsResponseItem[];
	}
	return webVitals;
}
