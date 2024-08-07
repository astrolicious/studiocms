import { addDts, addVirtualImports, createResolver, defineUtility } from 'astro-integration-kit';
import { fileFactory } from '../../utils/fileFactory';

export const componentResolver = defineUtility('astro:config:setup')(
	(params, options: { name: string; CustomImageOverride: string | undefined }) => {
		// Destructure Params
		const { config: astroConfig } = params;

		// Create Resolver for User-Defined Virtual Imports
		const { resolve: rootResolve } = createResolver(astroConfig.root.pathname);
		const { resolve } = createResolver(import.meta.url);

		// Create Virtual Resolver
		let customImageResolved: string;

		if (options.CustomImageOverride) {
			customImageResolved = rootResolve(options.CustomImageOverride);
		} else {
			customImageResolved = resolve('./components/CustomImage.astro');
		}

		addVirtualImports(params, {
			name: options.name,
			imports: {
				'studiocms:imageHandler/components': `export { default as CustomImage } from '${customImageResolved}';`,
			},
		});

		const customImageDTS = fileFactory();

		customImageDTS.addLines(`declare module 'studiocms:imageHandler/components' {
        /** 
         * # Custom Image Component for StudioCMS:imageHandler 
         * 
         * This component will adapt to the current configuration of the StudioCMS image handler and will render the used image accordingly.
         * 
         * The default configuration will use '@unpic/astro' to allow for image optimization and lazy loading from most popular image hosting services.
         * 
         * @props {string} src - Image Source
         * @props {string} alt - Image Alt
         * @props {number} width - Image Width
         * @props {number} height - Image Height
        */
        export const CustomImage: typeof import('${customImageResolved}').default;
        }`);

		addDts(params, {
			name: options.name,
			content: customImageDTS.text(),
		});
	}
);
