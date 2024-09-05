import { customRendererPlugin } from '@studiocms/core/lib';
import { addVirtualImports, createResolver, defineIntegration } from 'astro-integration-kit';
import { name } from '../package.json';
import { rendererDTS } from './stubs/renderer';

export default defineIntegration({
	name,
	setup({ name }) {
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
					addVirtualImports(params, {
						name,
						imports: {
							'studiocms:renderer': `export { default as StudioCMSRenderer } from '${ResolveRenderer()}';`,
						},
					});
				},
				'astro:config:done': async ({ injectTypes }) => {
					// Inject Types for Renderer
					injectTypes({
						filename: 'renderer.d.ts',
						content: rendererDTS(ResolveRenderer()),
					});
				},
			},
		};
	},
});
