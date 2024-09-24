import DTSBuilder from '@matthiesenxyz/astrodtsbuilder';
import { createResolver } from 'astro-integration-kit';

const { resolve } = createResolver(import.meta.url);

const authHelper = DTSBuilder();

authHelper.addSingleLineNote(
	'This file is generated by StudioCMS, And should not be modified manually'
);

authHelper.addModule('studiocms:auth/helpers', {
	namedExports: [
		{
			multiLineDescription: [
				'# Auth Helper Function',
				'',
				'@param locals The Astro.locals object',
				'@returns The current user data and session information',
				'',
				'@example',
				'---',
				"import { authHelper } from 'studiocms:auth/helpers'",
				'',
				'const { id, username, name, email, avatar, githubURL, permissionLevel, currentUserSession } = await authHelper(Astro.locals)',
				'---',
			],
			name: 'authHelper',
			typeDef: `typeof import('${resolve('../helpers/authHelper.ts')}').default`,
		},
	],
});

const dtsFile = authHelper.makeAstroInjectedType('auth-helper.d.ts');

export default dtsFile;
