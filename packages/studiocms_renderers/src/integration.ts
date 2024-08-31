import { customRendererPlugin } from '@studiocms/core';
import { addVirtualImports, createResolver, defineIntegration } from 'astro-integration-kit';

export default defineIntegration({
	name: '@studiocms/renderers',
	setup({ name }) {
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
						content: `declare module 'studiocms:renderer' {
                            /** 
                             * StudioCMS Content Renderer component 
                            */
                            export { default as StudioCMSRenderer } from '${ResolveRenderer()}';
                        }`,
					});
				},
			},
		};
	},
});
