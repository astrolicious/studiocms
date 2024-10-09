interface ImportMetaEnv {
	readonly PROD: boolean;
	readonly BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module 'virtual:studiocms-devapps/libsql-viewer' {
	const value: {
		readonly endpointPath: string;
	};
	export default value;
}
