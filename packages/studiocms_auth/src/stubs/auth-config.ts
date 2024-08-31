import fileFactory from '@matthiesenxyz/integration-utils/fileFactory';

const authconfigDTS = fileFactory();

authconfigDTS.addLines(`declare module 'studiocms:auth/config' {`);
authconfigDTS.addLines(
	`	const AuthSecurityConfig: import('@studiocms/core').usernameAndPasswordConfig;`
);
authconfigDTS.addLines('	export default AuthSecurityConfig;');
authconfigDTS.addLines('}');

const DTSFile = authconfigDTS.text();

export default DTSFile;
