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

// Sidebar link type
/**
 * @param id - The unique identifier for the link
 * @param href - The URL to redirect to
 * @param text - The text to display for the link
 * @param minPermissionLevel - The minimum permission level required to view the link (unknown, visitor, editor, admin)
 * @param icon - The icon to display for the link ( see https://shoelace.style/components/icon )
 */
export type SideBarLink = {
    id: string;
    href: string;
    text: string;
    minPermissionLevel: string;
    icon: string;
    type: "link" | "dropdown";
    dropdownItems?: SideBarLink[];
}

// Add default dashboard page links
const defaultDashboardPageLinks: SideBarLink[] = [
    { 
        id: "home", 
        href: StudioCMSRoutes.mainLinks.baseSiteURL, 
        text: "View Site", 
        minPermissionLevel: "unknown", 
        icon: "globe-americas", 
        type: "link" 
    }, { 
        id: "dashboard", 
        href: StudioCMSRoutes.mainLinks.dashboardIndex, 
        text: "Dashboard", 
        minPermissionLevel: "visitor", 
        icon: "columns-gap", 
        type: "link" 
    }, { 
        id: "profile", 
        href: StudioCMSRoutes.mainLinks.userProfile, 
        text: "User Profile", 
        minPermissionLevel: "visitor", 
        icon: "person-square", 
        type: "link" 
    }, { 
        id: "new-page", 
        href: StudioCMSRoutes.mainLinks.pageNew, 
        text: "Create New Page", 
        minPermissionLevel: "editor", 
        icon: "pencil-square", 
        type: "link" 
    }, { 
        id: "edit-pages", 
        href: StudioCMSRoutes.mainLinks.pageEdit, 
        text: "Edit Pages", 
        minPermissionLevel: "editor", 
        icon: "pencil", 
        type: "link" 
    }, { 
        id: "site-config", 
        href: StudioCMSRoutes.mainLinks.siteConfiguration, 
        text: "Site Configuration", 
        minPermissionLevel: "admin", 
        icon: "gear-wide-connected", 
        type: "link" 
    }
]

// Add custom dashboard page links
const customDashboardPageLinks: SideBarLink[] = [];

const customDashboardDropdown = { 
        id: "integrations", 
        href: "", 
        text: "Integration Configs", 
        minPermissionLevel: "editor", 
        icon: "puzzle", 
        type: "dropdown", 
        dropdownItems: [ ...customDashboardPageLinks ], 
    } satisfies SideBarLink;

// Side bar links map
const finalSideBarLinkMap: SideBarLink[] = [ ...defaultDashboardPageLinks ];

// Merge custom dashboard page links
if (customDashboardDropdown.dropdownItems.length > 0 ) {
    finalSideBarLinkMap.push(customDashboardDropdown);
}

export const sideBarLinkMap: SideBarLink[] = finalSideBarLinkMap;