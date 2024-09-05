import type { AstroConfig } from 'astro';
import { defineUtility } from 'astro-integration-kit';

// TODO: Update this when `astro:env` leaves experimental
// This will be in Astro v5, https://github.com/withastro/astro/blob/refs/heads/next/packages/astro/CHANGELOG.md#500-alpha1
/**
 * Add Astro Environment Variables Config for using 'astro:env'
 */
export const addAstroEnvConfig = defineUtility('astro:config:setup')(
	(params, config: AstroConfig['experimental']['env']) => {
		// Update Astro Config with Environment Variables (`astro:env`)
		params.updateConfig({
			experimental: { env: config },
		});
	}
);
