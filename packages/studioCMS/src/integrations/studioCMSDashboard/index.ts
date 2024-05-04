import { addDts, addVirtualImports, createResolver, defineIntegration } from "astro-integration-kit";
import { optionsSchema } from "../../schemas";
import { CheckENV, integrationLogger } from "../../utils";
import { loadEnv } from "vite";
import { fileFactory } from "../../utils/fileFactory";

// Environment Variables
const env = loadEnv('all', process.cwd(), 'CMS');

const AUTHKEYS = {
	GITHUBCLIENTID: {
		N: 'CMS_GITHUB_CLIENT_ID',
		KEY:
			env.CMS_GITHUB_CLIENT_ID ||
			import.meta.env.CMS_GITHUB_CLIENT_ID ||
			process.env.CMS_GITHUB_CLIENT_ID,
	},
	GITHUBCLIENTSECRET: {
		N: 'CMS_GITHUB_CLIENT_SECRET',
		KEY:
			env.CMS_GITHUB_CLIENT_SECRET ||
			import.meta.env.CMS_GITHUB_CLIENT_SECRET ||
			process.env.CMS_GITHUB_CLIENT_SECRET,
	}
};

export default defineIntegration({
    name: 'astrolicious/studioCMS:adminDashboard',
    optionsSchema,
    setup({ name, options }) {
        return {
            hooks: {
                "astro:config:setup": ( params ) => {

                    // Destructure the params and options
                    const { logger, addMiddleware } = params;
                    const { verbose } = options;

                    integrationLogger(logger, verbose, "info", "Dashboard Setup starting...");

                    // Check for Authenication Environment Variables
                    CheckENV(logger, verbose, AUTHKEYS);

					// Create Resolvers
					const { resolve } = createResolver(import.meta.url);

					// Virtual Resolver
					const virtResolver = { Auth: resolve('./lib/auth.ts'), };

					// Virtual Components
					const virtualComponentMap = `
					export * from '${virtResolver.Auth}';`;

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'studiocms-dashboard:auth': virtualComponentMap,
						},
					});

					// Create Virtual DTS File
					const studioCMSDTS = fileFactory();

					studioCMSDTS.addLines(`declare module 'studiocms-dashboard:auth' {
                        export const lucia: typeof import('${virtResolver.Auth}').lucia;
					}`);

					// Add Virtual DTS File
					addDts(params, {
						name,
						content: studioCMSDTS.text(),
					});

					// Add Middleware
					integrationLogger(logger, verbose, 'info', 'Adding Middleware');
					addMiddleware({
						entrypoint: resolve('./middleware/index.ts'),
						order: 'pre',
					});

                    // Log that the setup is complete
                    integrationLogger(logger, verbose, "info", "Dashboard ready!");

                }
            }
        }
}});