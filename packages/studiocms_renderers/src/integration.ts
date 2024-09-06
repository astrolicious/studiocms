import { customRendererPlugin, stringify } from '@studiocms/core/lib';
import { StudioCMSRendererConfigSchema as optionsSchema } from '@studiocms/core/schemas';
import { addVirtualImports, createResolver, defineIntegration } from 'astro-integration-kit';
import { name } from '../package.json';
import { rendererDTS } from './stubs/renderer';
import { rendererConfigDTS } from './stubs/renderer-config';
import { rendererAstroMarkdownDTS } from './stubs/renderer-markdownConfig';

export default defineIntegration({
	name,
	optionsSchema,
	setup({ name, options }) {
		// Create resolver relative to this file
		const { resolve } = createResolver(import.meta.url);

		// Get customRendererPlugin List and convert to Array
		let customRenderPlugin: string[] = [];
		if (customRendererPlugin) {
			customRenderPlugin = Array.from(customRendererPlugin);
		}

		// Resolve Renderer Path
		const ResolveRenderer = () => {
			let rendererPath: string;
			if (customRendererPlugin.size > 0 && customRenderPlugin[0]) {
				rendererPath = customRenderPlugin[0];
				return rendererPath;
			}
			return resolve('./components/StudioCMSRenderer.astro');
		};

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					const {
						config: { markdown: astroMarkdown },
					} = params;
					addVirtualImports(params, {
						name,
						imports: {
							'studiocms:renderer': `export { default as StudioCMSRenderer } from '${ResolveRenderer()}';`,
							'studiocms:renderer/config': `export default ${stringify(options)}`,
							'studiocms:renderer/astroMarkdownConfig': `export default ${stringify(astroMarkdown)}`,
						},
					});
				},
				'astro:config:done': async ({ injectTypes }) => {
					// Inject Types for Renderer
					injectTypes({
						filename: 'renderer.d.ts',
						content: rendererDTS(ResolveRenderer()),
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
