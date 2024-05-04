import { z } from 'astro/zod';

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
	 * Username and Password Auth Provider - Powered by Lucia
	 * 
	 * **NOT YET IMPLEMENTED**
	 */
	usernameAndPassword: z.boolean().optional().default(false),
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