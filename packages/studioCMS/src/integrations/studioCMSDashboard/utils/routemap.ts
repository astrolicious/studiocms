import { urlGenFactory } from "studiocms:helpers";
import Config from "virtual:studiocms/config";

const { dashboardConfig: { dashboardRouteOverride } } = Config;

export async function getSluggedRoute(
    url: string, 
    slug: string
): Promise<string> {
    return await urlGenFactory(true, url+slug, dashboardRouteOverride);
}

export async function getEditRoute( 
    slug: string 
): Promise<string> {
    return await getSluggedRoute("edit/pages/", slug);
}

export async function getDeleteRoute( 
    slug: string 
): Promise<string> {
    return await getSluggedRoute("delete/pages/", slug);
}

export const StudioCMSRoutes = {
    mainLinks: {
        baseSiteURL: await urlGenFactory(false, undefined),
        dashboardIndex: await urlGenFactory(true, undefined, dashboardRouteOverride),
        userProfile: await urlGenFactory(true, "profile/", dashboardRouteOverride),
        pageNew: await urlGenFactory(true, "new/page/"),
        pageEdit: await urlGenFactory(true, "page-list/", dashboardRouteOverride),
        siteConfiguration: await urlGenFactory(true, "configuration/"),
        livePreviewBox: await urlGenFactory(true, "api/liverender", dashboardRouteOverride),
        configurationAdmins: await urlGenFactory(true, "configuration/admins/", dashboardRouteOverride),
    },
    authLinks: {
        loginURL: await urlGenFactory(true, "login", dashboardRouteOverride),
        logoutURL: await urlGenFactory(true, "logout", dashboardRouteOverride),
        signupURL: await urlGenFactory(true, "signup/", dashboardRouteOverride),
        loginAPI: await urlGenFactory(true, "login/api/login", dashboardRouteOverride),
        registerAPI: await urlGenFactory(true, "login/api/register", dashboardRouteOverride),
        githubIndex: await urlGenFactory(true, "login/github", dashboardRouteOverride),
        githubCallback: await urlGenFactory(true, "login/github/callback", dashboardRouteOverride),
        discordIndex: await urlGenFactory(true, "login/discord", dashboardRouteOverride),
        discordCallback: await urlGenFactory(true, "login/discord/callback", dashboardRouteOverride),
        googleIndex: await urlGenFactory(true, "login/google", dashboardRouteOverride),
        googleCallback: await urlGenFactory(true, "login/google/callback", dashboardRouteOverride),
        auth0Index: await urlGenFactory(true, "login/auth0", dashboardRouteOverride),
        auth0Callback: await urlGenFactory(true, "login/auth0/callback", dashboardRouteOverride),
    },
}