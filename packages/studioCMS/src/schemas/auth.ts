import { z } from 'astro/zod';

const localUsernameAndPasswordConfig = z.object({
	/**
	 * Allow User Registration - Allows users to register an account
	 * 
	 * @default false - Temporarily set to true for testing
	 */
	allowUserRegistration: z.boolean().optional().default(true),
}).optional().default({});

//
// AUTH PROVIDER SCHEMA
//
export const authProviderSchema = z.object({
	/**
	 * GitHub Auth Provider - Powered by Lucia
	 * 
	 * Requires a GitHub OAuth App to be created and configured using ENV Variables
	 * 
	 * @default true
	 */
	github: z.boolean().optional().default(true),
	/**
	 * Discord Auth Provider - Powered by Lucia
	 * 
	 * Requires a Discord OAuth App to be created and configured using ENV Variables
	 * 
	 * @default false - Temporarily set to true for testing
	 */
	discord: z.boolean().optional().default(true),
	/**
	 * Google Auth Provider - Powered by Lucia
	 * 
	 * Requires a Google OAuth App to be created and configured using ENV Variables
	 * 
	 * @default false - Temporarily set to true for testing
	 */
	google: z.boolean().optional().default(true),
	/**
	 * Auth0 Auth Provider - Powered by Lucia
	 * 
	 * Requires an Auth0 Application to be created and configured using ENV Variables
	 * 
	 * @default false - Temporarily set to true for testing
	 */
	auth0: z.boolean().optional().default(true),
	/**
	 * Username and Password Auth Provider - Powered by Lucia
	 * 
	 */
	usernameAndPassword: z.boolean().optional().default(true),
	usernameAndPasswordConfig: localUsernameAndPasswordConfig,
}).optional().default({});

//
// AUTH CONFIG SCHEMA
//
export const authConfigSchema = z.object({
	/**
	 * Auth Providers - Allows enabling or disabling of the Authentication Providers
	 */
	providers: authProviderSchema,
	/**
	 * Auth Enabled - Allows enabling or disabling of the Authentication Configuration
	 * 
	 * @default true
	 */
	enabled: z.boolean().optional().default(true),
}).optional().default({});