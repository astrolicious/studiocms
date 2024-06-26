import type { AstroIntegrationLogger } from "astro";
import { loadEnv } from "vite";
import { studioLogger, studioLoggerOptsResolver } from "../../../utils";
import { CheckENVStrings } from "../../../strings";
import type { StudioCMSOptions } from "../schemas";

const KeyList = {
    Github: {
        Keys: [
            'CMS_GITHUB_CLIENT_ID', 
            'CMS_GITHUB_CLIENT_SECRET'
        ],
        messages: CheckENVStrings.GithubMessages
    },
    Discord: {
        Keys: [
            'CMS_DISCORD_CLIENT_ID', 
            'CMS_DISCORD_CLIENT_SECRET', 
            'CMS_DISCORD_REDIRECT_URI'
        ],
        messages: CheckENVStrings.DiscordMessages
    },
    Google: {
        Keys: [
            'CMS_GOOGLE_CLIENT_ID', 
            'CMS_GOOGLE_CLIENT_SECRET', 
            'CMS_GOOGLE_REDIRECT_URI'
        ],
        messages: CheckENVStrings.GoogleMessages
    },
    Auth0: {
        Keys: [
            'CMS_AUTH0_CLIENT_ID', 
            'CMS_AUTH0_CLIENT_SECRET', 
            'CMS_AUTH0_DOMAIN', 
            'CMS_AUTH0_REDIRECT_URI'
        ],
        messages: CheckENVStrings.Auth0Messages
    }
}

const env = loadEnv('all', process.cwd(), 'CMS')

export const loadKeys = async (
    logger: AstroIntegrationLogger, 
    options: StudioCMSOptions,
) => {

    const { verbose, dashboardConfig: { AuthConfig: { providers } } } = options;

    const { logInfo, logWarn } = await studioLoggerOptsResolver(logger, verbose);

    const infoLogger = (message: string) => {
        studioLogger(logInfo, message)
    }
    const warnLogger = (message: string) => {
        studioLogger(logWarn, message)
    }

    infoLogger(CheckENVStrings.CheckStart);

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
        infoLogger(GithubKeys.messages.CheckMessage)
        // biome-ignore lint/complexity/noForEach: This is a simple loop
        GithubKeys.Keys.forEach(key => {
            if (!env[key]) {
                missingGithubKeys.push(key)
                missingKeys.push(key)
            }
        })
        if (missingGithubKeys.length > 0) {
            warnLogger(`${GithubKeys.messages.ErrorMessage} ${missingGithubKeys.join(', ')}`)
        }
    }

    // Check for Discord Environment Variables
    const missingDiscordKeys:string[] = [];
    if (discord) {
        infoLogger(DiscordKeys.messages.CheckMessage)
        // biome-ignore lint/complexity/noForEach: This is a simple loop
        DiscordKeys.Keys.forEach(key => {
            if (!env[key]) {
                missingDiscordKeys.push(key)
                missingKeys.push(key)
            }
        })
        if (missingDiscordKeys.length > 0) {
            warnLogger(`${DiscordKeys.messages.ErrorMessage} ${missingDiscordKeys.join(', ')}`)
        }
    }

    // Check for Google Environment Variables
    const missingGoogleKeys:string[] = [];
    if (google) {
        infoLogger(GoogleKeys.messages.CheckMessage)
        // biome-ignore lint/complexity/noForEach: This is a simple loop
        GoogleKeys.Keys.forEach(key => {
            if (!env[key]) {
                missingGoogleKeys.push(key)
                missingKeys.push(key)
            }
        })
        if (missingGoogleKeys.length > 0) {
            warnLogger(`${GoogleKeys.messages.ErrorMessage} ${missingGoogleKeys.join(', ')}`)
        }
    }

    // Check for Auth0 Environment Variables
    const missingAuth0Keys:string[] = [];
    if (auth0) {
        infoLogger(Auth0Keys.messages.CheckMessage)
        // biome-ignore lint/complexity/noForEach: This is a simple loop
        Auth0Keys.Keys.forEach(key => {
            if (!env[key]) {
                missingAuth0Keys.push(key)
                missingKeys.push(key)
            }
        })
        if (missingAuth0Keys.length > 0) {
            warnLogger(`${Auth0Keys.messages.ErrorMessage} ${missingAuth0Keys.join(', ')}`)
        }
    }

    // If all Environment Variables are set log an info message
    if ( missingKeys.length === 0 ) {
        infoLogger(CheckENVStrings.CheckComplete)
    }
}