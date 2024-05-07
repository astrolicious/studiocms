type Providers = {
    github: boolean;
    discord: boolean;
    google: boolean;
}

const AUTHKEYS = {
    GITHUB: {
        CLIENT_ID: import.meta.env.CMS_GITHUB_CLIENT_ID || process.env.CMS_GITHUB_CLIENT_ID,
        CLIENT_SECRET: import.meta.env.CMS_GITHUB_CLIENT_SECRET || process.env.CMS_GITHUB_CLIENT_SECRET,
    },
    DISCORD: {
        CLIENT_ID: import.meta.env.CMS_DISCORD_CLIENT_ID || process.env.CMS_DISCORD_CLIENT_ID,
        CLIENT_SECRET: import.meta.env.CMS_DISCORD_CLIENT_SECRET || process.env.CMS_DISCORD_CLIENT_SECRET,
        REDIRECT_URI: import.meta.env.CMS_DISCORD_REDIRECT_URI || process.env.CMS_DISCORD_REDIRECT_URI,
    },
    GOOGLE: {
        CLIENT_ID: import.meta.env.CMS_GOOGLE_CLIENT_ID || process.env.CMS_GOOGLE_CLIENT_ID,
        CLIENT_SECRET: import.meta.env.CMS_GOOGLE_CLIENT_SECRET || process.env.CMS_GOOGLE_CLIENT_SECRET,
        REDIRECT_URI: import.meta.env.CMS_GOOGLE_REDIRECT_URI || process.env.CMS_GOOGLE_REDIRECT_URI,
    },
}

type AuthEnvCheckReponse = {
    GITHUB: {
        ENABLED: boolean;
        CLIENT_ID: string|undefined;
        CLIENT_SECRET: string|undefined;
    };
    DISCORD: {
        ENABLED: boolean;
        CLIENT_ID: string|undefined;
        CLIENT_SECRET: string|undefined;
        REDIRECT_URI: string|undefined;
    };
    GOOGLE: {
        ENABLED: boolean;
        CLIENT_ID: string|undefined;
        CLIENT_SECRET: string|undefined;
        REDIRECT_URI: string|undefined;
    };
}
let GITHUBENABLED: boolean
let DISCORDENABLED: boolean
let GOOGLEENABLED: boolean

export async function authEnvCheck(providers: Providers): Promise<AuthEnvCheckReponse> {

    if (providers.github) {
        if (!AUTHKEYS.GITHUB.CLIENT_ID || !AUTHKEYS.GITHUB.CLIENT_SECRET) {
            GITHUBENABLED = false
        } else {
            GITHUBENABLED = true
        }
    }

    if (providers.discord) {
        if (!AUTHKEYS.DISCORD.CLIENT_ID || !AUTHKEYS.DISCORD.CLIENT_SECRET || !AUTHKEYS.DISCORD.REDIRECT_URI) {
            DISCORDENABLED = false
        } else {
            DISCORDENABLED = true
        }
    }

    if (providers.google) {
        if (!AUTHKEYS.GOOGLE.CLIENT_ID || !AUTHKEYS.GOOGLE.CLIENT_SECRET || !AUTHKEYS.GOOGLE.REDIRECT_URI) {
            GOOGLEENABLED = false
        } else {
            GOOGLEENABLED = true
        }
    }

    return {
        GITHUB: {
            ENABLED: GITHUBENABLED,
            CLIENT_ID: AUTHKEYS.GITHUB.CLIENT_ID,
            CLIENT_SECRET: AUTHKEYS.GITHUB.CLIENT_SECRET,
        },
        DISCORD: {
            ENABLED: DISCORDENABLED,
            CLIENT_ID: AUTHKEYS.DISCORD.CLIENT_ID,
            CLIENT_SECRET: AUTHKEYS.DISCORD.CLIENT_SECRET,
            REDIRECT_URI: AUTHKEYS.DISCORD.REDIRECT_URI,
        },
        GOOGLE: {
            ENABLED: GOOGLEENABLED,
            CLIENT_ID: AUTHKEYS.GOOGLE.CLIENT_ID,
            CLIENT_SECRET: AUTHKEYS.GOOGLE.CLIENT_SECRET,
            REDIRECT_URI: AUTHKEYS.GOOGLE.REDIRECT_URI,
        },
    }

}