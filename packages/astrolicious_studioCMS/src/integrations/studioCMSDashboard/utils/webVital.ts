import { logger } from '@it-astro:logger:StudioCMS';
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
	// Check if AstrojsWebVitals exists
	if (!AstrojsWebVitals_Metric) {
		logger.warn(
			'@astrojs/web-vitals table not found.  If you have not installed the package you can disregard this warning.'
		);
		return [] as WebVitalsResponseItem[];
	}

	try {
		// Execute the database query
		const webVitals: WebVitalsResponseItem[] = await db.select().from(AstrojsWebVitals_Metric);

		// Return the results if successful
		return webVitals;
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(
			`Error getting @astrojs/web-vitals table data.  If you have not installed the package you can disregard this error.\n - ${error}`
		);
		return [] as WebVitalsResponseItem[];
	}
}
