import { addVirtualImports, createResolver, defineUtility } from 'astro-integration-kit';
import {
	dashboardPageLinksMap,
	externalNavigation,
	stringify,
	stringifyMap,
	studioCMSPluginList,
} from '../lib';
import type { StudioCMSOptions } from '../schemas';
import { dtsFile } from '../stubs/dts';

export const coreVirtualModuleGeneration = defineUtility('astro:config:setup')(
	(
		params,
		name,
		options: {
			StudioCMSConfig: StudioCMSOptions;
			currentVersion: string;
			overrides?:
				| {
						FormattedDateOverride?: string | undefined;
				  }
				| undefined;
		}
	) => {
		// Destructure Params and Options
		const { StudioCMSConfig, currentVersion, overrides } = options;
		const { config: astroConfig } = params;

		// Get the Markdown Remark Config
		const { markdown: astroMarkdown } = astroConfig;

		// Create Resolver for Virtual Imports
		const { resolve } = createResolver(import.meta.url);

		// Setup the Plugin Module
		let pluginModule = '';
		pluginModule += `export const externalNav = new Map(${stringifyMap(externalNavigation)});\n`;
		pluginModule += `export const dashboardPageLinks = new Map(${stringifyMap(dashboardPageLinksMap)});\n`;
		pluginModule += `export const pluginList = new Map(${stringifyMap(studioCMSPluginList)});\n`;

		// Setup the Resolvers
		const contentHelperResolved = resolve('../helpers/contentHelper.ts');
		const headDefaultsResolved = resolve('../components/headDefaults.ts');

		// Component Resolvers
		const componentResolvers = {
			Avatar: resolve('../components/Avatar.astro'),
			FormattedDate:
				overrides?.FormattedDateOverride || resolve('../components/FormattedDate.astro'),
			Genericheader: resolve('../components/GenericHeader.astro'),
			Navigation: resolve('../components/Navigation.astro'),
		};

		// Map the Components to form the Virtual Components
		let virtualComponents = '';
		for (const [key, value] of Object.entries(componentResolvers)) {
			virtualComponents += `export { default as ${key} } from '${value}';\n`;
		}

		// Helpers Resolvers
		const helpersNamedResolvers = {
			authHelper: resolve('../helpers/authHelper.ts'),
			urlGenFactory: resolve('../helpers/urlGenFactory.ts'),
		};

		const helpersUnnamedResolvers = {
			formatters: resolve('../helpers/formatters.ts'),
			pathGenerators: resolve('../helpers/pathGenerators.ts'),
		};

		// Map the Helpers to form the Virtual Helpers
		let virtualHelpers = '';
		for (const [key, value] of Object.entries(helpersNamedResolvers)) {
			virtualHelpers += `export { default as ${key} } from '${value}';\n`;
		}

		for (const [value] of Object.entries(helpersUnnamedResolvers)) {
			virtualHelpers += `export * from '${value}';\n`;
		}

		// Create the Virtual Modules Map
		const virtualModules: Record<string, string> = {
			'virtual:studiocms/config': `export default ${stringify(StudioCMSConfig)}`,
			'virtual:studiocms/version': `export default '${currentVersion}'`,
			'virtual:studiocms/astromdremarkConfig': `export default ${stringify(astroMarkdown)}`,
			'virtual:studiocms/pluginSystem': pluginModule,
			'studiocms:components': virtualComponents,
			'studiocms:helpers': virtualHelpers,
			'studiocms:helpers/contentHelper': `export * from '${contentHelperResolved}';`,
			'studiocms:helpers/headDefaults': `export * from '${headDefaultsResolved}';`,
		};

		// Inject the Virtual Imports
		addVirtualImports(params, { name, imports: virtualModules });

		// Build the declaration file
		const dtsFileOutput = dtsFile(
			{
				Avatar: componentResolvers.Avatar,
				FormattedDate: componentResolvers.FormattedDate,
				Genericheader: componentResolvers.Genericheader,
				Navigation: componentResolvers.Navigation,
			},
			{
				authHelper: helpersNamedResolvers.authHelper,
				urlGenFactory: helpersNamedResolvers.urlGenFactory,
				formatters: helpersUnnamedResolvers.formatters,
				pathGenerators: helpersUnnamedResolvers.pathGenerators,
				contentHelper: contentHelperResolved,
				headDefaults: headDefaultsResolved,
			}
		);

		return { dtsFileOutput };
	}
);
