import DTSBuilder from '@matthiesenxyz/astrodtsbuilder';
import { createResolver } from 'astro-integration-kit';

// Create resolver relative to this file
const { resolve } = createResolver(import.meta.url);

/**
 * Generate the `config.d.ts` file
 */
export const rendererConfigDTS = () => {
	const dtsFile = DTSBuilder();

	dtsFile.addSingleLineNote(
	'This file is generated by StudioCMS and should not be modified manually.'
	);

	dtsFile.addModule('studiocms:renderer/config', {
		defaultExport: {
			singleLineDescription: 'Renderer Configuration',
			typeDef: `import('${resolve('../index')}').StudioCMSRendererConfig`,
		},
	});

	const dtsText = dtsFile.makeAstroInjectedType('config.d.ts');

	return dtsText;
};
