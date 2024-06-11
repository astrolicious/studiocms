import type { AstroIntegrationLogger } from "astro";
import { loadEnv } from "vite";
import { integrationLogger } from "../../../utils";
import type { AuthProviders } from "../../../schemas/auth";

const KeyList = {
    Github: {
        Keys: [
            'CMS_GITHUB_CLIENT_ID', 
            'CMS_GITHUB_CLIENT_SECRET'
        ],
        CheckMessage: 'Github Auth Enabled, Checking Github Environment Variables...',
        ErrorMessage: 'The Following Github Keys are Missing and are Required for the Github Authentication to work:'
    },
    Discord: {
        Keys: [
            'CMS_DISCORD_CLIENT_ID', 
            'CMS_DISCORD_CLIENT_SECRET', 
            'CMS_DISCORD_REDIRECT_URI'
        ],
        CheckMessage: 'Discord Auth Enabled, Checking Discord Environment Variables...',
        ErrorMessage: 'The Following Discord Keys are Missing and are Required for the Discord Authentication to work:'
    },
    Google: {
        Keys: [
            'CMS_GOOGLE_CLIENT_ID', 
            'CMS_GOOGLE_CLIENT_SECRET', 
            'CMS_GOOGLE_REDIRECT_URI'
        ],
        CheckMessage: 'Google Auth Enabled, Checking Google Environment Variables...',
        ErrorMessage: 'The Following Google Keys are Missing and are Required for the Google Authentication to work:'
    },
    Auth0: {
        Keys: [
            'CMS_AUTH0_CLIENT_ID', 
            'CMS_AUTH0_CLIENT_SECRET', 
            'CMS_AUTH0_DOMAIN', 
            'CMS_AUTH0_REDIRECT_URI'
        ],
        CheckMessage: 'Auth0 Auth Enabled, Checking Auth0 Environment Variables...',
        ErrorMessage: 'The Following Auth0 Keys are Missing and are Required for the Auth0 Authentication to work:'
    }
}

const env = loadEnv('all', process.cwd(), 'CMS')

export const loadKeys = async (
    logger: AstroIntegrationLogger, 
    verbose: boolean, 
    providers: AuthProviders
) => {
    const infoLogger = (message: string) => {
        integrationLogger(logger, verbose, 'info', message)
    }
    const warnLogger = (message: string) => {
        integrationLogger(logger, verbose, 'warn', message)
    }

    infoLogger('Checking Environment Variables...');

    const { 
        github, 
        discord, 
        google, 
        auth0 
    } = providers;

    const { 
        Github: GithubKeys, 
        Discord: DiscordKeys, 
        Google: GoogleKeys, 
        Auth0: Auth0Keys 
    } = KeyList;

    // List of all currently missing keys
    const missingKeys:string[] = [];

    // Check for Github Environment Variables
    const missingGithubKeys:string[] = [];
    if (github) {
        infoLogger(GithubKeys.CheckMessage)
        // biome-ignore lint/complexity/noForEach: This is a simple loop
        GithubKeys.Keys.forEach(key => {
            if (!env[key]) {
                missingGithubKeys.push(key)
                missingKeys.push(key)
            }
        })
        if (missingGithubKeys.length > 0) {
            warnLogger(`${GithubKeys.ErrorMessage} ${missingGithubKeys.join(', ')}`)
        }
    }

    // Check for Discord Environment Variables
    const missingDiscordKeys:string[] = [];
    if (discord) {
        infoLogger(DiscordKeys.CheckMessage)
        // biome-ignore lint/complexity/noForEach: This is a simple loop
        DiscordKeys.Keys.forEach(key => {
            if (!env[key]) {
                missingDiscordKeys.push(key)
                missingKeys.push(key)
            }
        })
        if (missingDiscordKeys.length > 0) {
            warnLogger(`${DiscordKeys.ErrorMessage} ${missingDiscordKeys.join(', ')}`)
        }
    }

    // Check for Google Environment Variables
    const missingGoogleKeys:string[] = [];
    if (google) {
        infoLogger(GoogleKeys.CheckMessage)
        // biome-ignore lint/complexity/noForEach: This is a simple loop
        GoogleKeys.Keys.forEach(key => {
            if (!env[key]) {
                missingGoogleKeys.push(key)
                missingKeys.push(key)
            }
        })
        if (missingGoogleKeys.length > 0) {
            warnLogger(`${GoogleKeys.ErrorMessage} ${missingGoogleKeys.join(', ')}`)
        }
    }

    // Check for Auth0 Environment Variables
    const missingAuth0Keys:string[] = [];
    if (auth0) {
        infoLogger(Auth0Keys.CheckMessage)
        // biome-ignore lint/complexity/noForEach: This is a simple loop
        Auth0Keys.Keys.forEach(key => {
            if (!env[key]) {
                missingAuth0Keys.push(key)
                missingKeys.push(key)
            }
        })
        if (missingAuth0Keys.length > 0) {
            warnLogger(`${Auth0Keys.ErrorMessage} ${missingAuth0Keys.join(', ')}`)
        }
    }

    // If all Environment Variables are set log an info message
    if ( missingKeys.length === 0 ) {
        infoLogger('All Environment Variables are Set.')
    }
}