import type { AstroConfig } from "astro";
import { envField } from "astro/config";

export const astroENV: AstroConfig['experimental']['env'] = {
    schema: {
        // GitHub Auth Provider Environment Variables
        CMS_GITHUB_CLIENT_ID: envField.string({ 
            context: 'server', 
            access: 'secret' 
        }),
        CMS_GITHUB_CLIENT_SECRET: envField.string({ 
            context: 'server', 
            access: 'secret' 
        }),
        // Discord Auth Provider Environment Variables
        CMS_DISCORD_CLIENT_ID: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        CMS_DISCORD_CLIENT_SECRET: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        CMS_DISCORD_REDIRECT_URI: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        // Google Auth Provider Environment Variables
        CMS_GOOGLE_CLIENT_ID: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        CMS_GOOGLE_CLIENT_SECRET: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        CMS_GOOGLE_REDIRECT_URI: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        // Auth0 Auth Provider Environment Variables
        CMS_AUTH0_CLIENT_ID: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        CMS_AUTH0_CLIENT_SECRET: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        CMS_AUTH0_DOMAIN: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
        CMS_AUTH0_REDIRECT_URI: envField.string({ 
            context: 'server',
            access: 'secret'
        }),
    }
}