import { runtimeLogger } from '@inox-tools/runtime-logger';
import { stringify } from '@studiocms/core/lib';
import { StudioCMSRendererConfigSchema } from '@studiocms/core/schemas/renderer';
import { addVirtualImports, createResolver, defineIntegration } from 'astro-integration-kit';
import { name } from '../package.json';
import { rendererDTS } from './stubs/renderer';
import { rendererConfigDTS } from './stubs/renderer-config';
import { rendererAstroMarkdownDTS } from './stubs/renderer-markdownConfig';

export default defineIntegration({
	name,
	optionsSchema: StudioCMSRendererConfigSchema,
	setup({ name, options }) {
		// Create resolver relative to this file
		const { resolve } = createResolver(import.meta.url);

		const RendererComponent = resolve('./components/StudioCMSRenderer.astro');

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const {
						config: { markdown: astroMarkdown },
					} = params;

					runtimeLogger(params, { name: 'studiocms-renderer' });

					addVirtualImports(params, {
						name,
						imports: {
							'studiocms:renderer': `export { default as StudioCMSRenderer } from '${RendererComponent}';`,
							'studiocms:renderer/config': `export default ${stringify(options)}`,
							'studiocms:renderer/astroMarkdownConfig': `export default ${stringify(astroMarkdown)}`,
						},
					});
				},
				'astro:config:done': async ({ injectTypes }) => {
					// Inject Types for Renderer
					injectTypes({
						filename: 'renderer.d.ts',
						content: rendererDTS(RendererComponent),
					});
					injectTypes({
						filename: 'config.d.ts',
						content: rendererConfigDTS(),
					});
					injectTypes({
						filename: 'astroMarkdownConfig.d.ts',
						content: rendererAstroMarkdownDTS(),
					});
				},
			},
		};
	},
});
