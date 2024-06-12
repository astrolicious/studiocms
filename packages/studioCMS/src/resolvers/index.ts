import { createResolver } from "astro-integration-kit"
import { customRendererPlugin } from "../index";
import { fileFactory } from "../utils/fileFactory";

const { resolve } = createResolver(import.meta.url)

let ROP: string[] = []
if (customRendererPlugin) {
    ROP = Array.from(customRendererPlugin)
}

const StudioCMSRendererResolver = () => {
    let RendererPath: string
    if (customRendererPlugin.size > 0 && ROP[0]) {
        RendererPath = ROP[0]
        return RendererPath
    }
    return resolve('../components/exports/StudioCMSRenderer.astro');
}

export const VirtualResolver = ( 
    CustomImagePath: string|undefined,
    FormattedDatePath: string|undefined,
 ) => {

    let CustomImageResolved: string

    if (CustomImagePath) {
        CustomImageResolved = CustomImagePath
    } else {
        CustomImageResolved = resolve('../components/exports/CImage.astro')
    }

    let FormattedDateResolved: string

    if (FormattedDatePath) {
        FormattedDateResolved = FormattedDatePath
    } else {
        FormattedDateResolved = resolve('../components/exports/FormattedDate.astro')
    }

    return {
        CImage: CustomImageResolved,
        FormattedDate: FormattedDateResolved,
        StudioCMSRenderer: StudioCMSRendererResolver(),
        AuthHelper: resolve('../utils/authhelper.ts'),
        StudioCMSLocalsMap: resolve('../schemas/locals.ts'),
        StudioCMSDBTypeHelpers: resolve('../schemas/dbtypehelpers.ts'),
        UrlGenHelper: resolve('../utils/urlGen.ts'),
        textFormatterHelper: resolve('../utils/textFormatter.ts'),
        contentHelper: resolve('../utils/contentHelper.ts'),
        NavigationBar: resolve('../components/exports/Navigation.astro'),
        Avatar: resolve('../components/exports/Avatar.astro'),
        defaultLayout: resolve('../defaultRoutes/components/Layout.astro'),
    }

}

type VirtResolver = {
    CImage: string;
    FormattedDate: string;
    StudioCMSRenderer: string;
    AuthHelper: string;
    StudioCMSLocalsMap: string;
    StudioCMSDBTypeHelpers: string;
    UrlGenHelper: string;
    textFormatterHelper: string;
    contentHelper: string;
    NavigationBar: string;
    Avatar: string;
    defaultLayout: string;
}

export const DTSResolver = (virtResolver: VirtResolver) => {

// Create Virtual DTS File
const studioCMSDTS = fileFactory();

// Add Virtual DTS Lines - Components
studioCMSDTS.addLines(`declare module 'studiocms:components' {
    /** Custom Image Component for StudioCMS:imageHandler 
     * 
     * This component will adapt to the current congiguration of the StudioCMS image handler and will render the used image accordingly.
     * 
     * The default configuration will use '@unpic/astro' to allow for image optimization and lazy loading from most popular image hosting services.
     * 
     * @props {string} src - Image Source
     * @props {string} alt - Image Alt
     * @props {number} width - Image Width
     * @props {number} height - Image Height
    */
	export const CImage: typeof import('${virtResolver.CImage}').default;
    /** Formatted Date Component used for rendering dates in a human readable format 
     * 
     * This components locale will adapt to the current configuration of the StudioCMS 'dateLocale' settings configuration option.
     * 
     * @props {string(Date)} date - Date String
    */
	export const FormattedDate: typeof import('${virtResolver.FormattedDate}').default;
    /** StudioCMSRenderer Component used for rendering StudioCMS content 
     * 
     * This component will render StudioCMS content using the StudioCMS content renderer and will adapt to the current configuration of the StudioCMS 'contentRenderer' settings configuration option.
     * 
     * @props {string} content - StudioCMS Content
    */
	export const StudioCMSRenderer: typeof import('${virtResolver.StudioCMSRenderer}').default;
    /** Navigation Component used for rendering StudioCMS User Facing Navigation
     * 
     * This component is a helper component that will render the StudioCMS user facing navigation to assist in easy navigation of your built front-end site
     * 
     * @props {topLevelLinkCount} number - Number of top level links to display before collapsing into a dropdown
     * @props {hideAvatar} boolean - Hide the user avatar/Login button in the navigation bar
    */
	export const Navigation: typeof import('${virtResolver.NavigationBar}').default;
    /** Avatar Component used for the Navigation Component 
     * 
     * This component has no props and will render the current user avatar or a default avatar if no user is logged in based on the Astro.locals object
    */
	export const Avatar: typeof import('${virtResolver.Avatar}').default;
    /** Layout Component used for rendering the StudioCMS default layout 
     * 
     * This component is the default layout component for the user facing site and will render the site header, footer, and main content area
     * 
     * @props {string} title - Page Title
     * @props {string} description - Page Description
     * @props {string} lang - Page Language (ISO 639-1)
     * @props {string} heroImage - Hero Image URL
     * @props {string} siteTitle - Site Title
     * @props {string} siteDescription - Site Description
     * @props {string} pageTitleDeliminter - Page Title Deliminter (Default: '|')
     * @props {string} pageDescriptionDeliminter - Page Description Deliminter (Default: '-')
    */
	export const Layout: typeof import('${virtResolver.defaultLayout}').default;
    /**
     * A helper function to get the content of a page by its slug.
     * 
     * @param slug The slug of the page to get the content of. Defined in the PageData table.
     * @param lang **Not implemented yet.** The language to get the content in. Default is 'default'.
     * @param package **Not implemented yet.** The package to get the content from. Default is '@astrolicious/studiocms'. 
     * @returns The data and content of the page.
     * 
     * @example 
     * ---
     * // Get the content of the index page:
     * import { StudioCMSRenderer, contentHelper } from 'studiocms:components'
     * 
     * const { title, description, heroImage, content } = await contentHelper("index")
     * ---
     * 
     * <h1>{title}</h1>
     * <p>{description}</p>
     * <img src={heroImage} alt={title} />
     * <StudioCMSRenderer content={content} />
     * 
    */
	export const contentHelper: typeof import('${virtResolver.contentHelper}').contentHelper;
    /**
     * Site Configuration helper function to get the site configuration data from Astro Studio's Database.
     * 
     * @returns The site configuration data. (Title, Description)
    */
	export const getSiteConfig: typeof import('${virtResolver.contentHelper}').getSiteConfig;
    /**
     * Get page list helper function to get a list of all pages from Astro Studio's database.
     * 
     * @returns A Array of all pages in the database in ascending order of their published date.
    */
	export const getPageList: typeof import('${virtResolver.contentHelper}').getPageList;
    /**
     * Get user list helper function to get a list of all users from Astro Studio's Database.
     * 
     * @returns A Array of all users in the database.
    */
	export const getUserList: typeof import('${virtResolver.contentHelper}').getUserList;
    /**
     * Get user by ID helper function to get a user by their ID from Astro Studio's Database.
     * 
     * @param userId The ID of the user to get. You can get this from 'Astro.locals.dbUser.id' when StudioCMS Auth middleware is used.
     * @returns The user data.
    */
	export const getUserById: typeof import('${virtResolver.contentHelper}').getUserById;
    /** Content Helper Temp Response Type 
     * 
     * type ContentHelperTempResponse = {
     *   id: string;
     *   package: string;
     *   title: string;
     *   description: string;
     *   publishedAt: Date;
     *   updatedAt: Date | null;
     *   slug: string;
     *   heroImage: string;
     *   content: string;
     * }
    */
	export type ContentHelperTempResponse = import('${virtResolver.contentHelper}').ContentHelperTempResponse;
    /** Site Config Response Type 
     * 
     * type SiteConfigResponse = {
     *   title: string;
     *   id: number;
     *   description: string;
     * }
    */
	export type SiteConfigResponse = import('${virtResolver.contentHelper}').SiteConfigResponse;
    /** Page Data Response Type
     * 
     * type pageDataReponse = {
     *   title: string;
     *   id: string;
     *   package: string;
     *   description: string;
     *   showOnNav: boolean;
     *   publishedAt: Date;
     *   updatedAt: Date | null;
     *   slug: string;
     *   contentLang: string | null;
     *   heroImage: string;
     * }
    */
	export type pageDataReponse = import('${virtResolver.contentHelper}').pageDataReponse;
    /** User Response Type
     * 
     * type UserResponse = {
     *   id: string;
     *   name: string;
     *   username: string;
     *   url: string | null;
     *   email: string | null;
     *   avatar: string | null;
     *   githubId: number | null;
     *   githubURL: string | null;
     *   discordId: string | null;
     *   googleId: string | null;
     *   auth0Id: string | null;
     *   password: string | null;
     *   updatedAt: Date | null;
     *   createdAt: Date | null;
     * }
    */
	export type UserResponse = import('${virtResolver.contentHelper}').UserResponse;
}`);

// Add Virtual DTS Lines - Helpers
studioCMSDTS.addLines(`declare module 'studiocms:helpers' {
    /** Local Schema Type - This may be out of date W.I.P.
     * 
     * type Locals = {
     *  isLoggedIn: boolean;
     *  dbUser: {
     *    id: string;
     *    url: string | null;
     *    name: string;
     *    email: string | null;
     *    avatar: string | null;
     *    githubId: number;
     *    githubURL: string | null;
     *    username: string;
     *    updatedAt: Date | null;
     *    createdAt: Date | null;
     *  };
     *  user: {
     *    id: number;
     *    username: string;
     *    githubId: number;
     *  };
     * }
    */
	export type Locals = import('${virtResolver.StudioCMSLocalsMap}').Locals;
    /** Astro DB Schema Type Helpers
     * 
     * type PageDataAndContent = {
     *   PageData: {
     *     id: string;
     *     package: string;
     *     title: string;
     *     description: string;
     *     showOnNav: boolean;
     *     publishedAt: Date;
     *     updatedAt: Date | null;
     *     slug: string;
     *     contentLang: string | null;
     *     heroImage: string;
     *   };
     *   PageContent: {
     *     id: string;
     *     contentId: string;
     *     contentLang: string;
     *     content: string | null;
     *   };
     *   SiteConfig: {
     *     id: number;
     *     title: string;
     *     description: string;
     *   };
     *   Permissions: {
     *     username: string;
     *     rank: string;
     *   };
     *   User: {
     *     id: string;
     *     name: string;
     *     username: string;
     *     url: string | null;
     *     email: string | null;
     *     avatar: string | null;
     *     githubId: number | null;
     *     githubURL: string | null;
     *     discordId: string | null;
     *     googleId: string | null;
     *     auth0Id: string | null;
     *     password: string | null;
     *     updatedAt: Date | null;
     *     createdAt: Date | null;
     *   };
     * }
    */
	export type PageDataAndContent = import('${virtResolver.StudioCMSDBTypeHelpers}').PageDataAndContent;
    /** Auth Helper Function
     * 
     * @param locals The Astro.locals object
     * @returns The current user data and session information
     * 
     * @example
     * ---
     * import { authHelper, type Locals } from 'studiocms:helpers'
     * 
     * const { id, username, name, email, avatar, githubURL, permissionLevel, currentUserSession } = await authHelper(Astro.locals as Locals)
     * ---
    */
	export const authHelper: typeof import('${virtResolver.AuthHelper}').default;
    /** Zod Schema for Locals */
	export const LocalsSchema: typeof import('${virtResolver.StudioCMSLocalsMap}').LocalsSchema;
    /** Zod Schema for Astro DB Type Helpers */
	export const PageDataAndContentSchema: typeof import('${virtResolver.StudioCMSDBTypeHelpers}').PageDataAndContentSchema;
    /** URL Generation Helper Function
     * 
     * @param {boolean} isDashboardRoute - Is this a dashboard route?
     * @param {string} path - The path to generate the URL for
     * @param {string} DashboardRoute - The dashboard route to use (Default: 'dashboard')
    */
	export const urlGenFactory: typeof import('${virtResolver.UrlGenHelper}').default;
    /** Text Formatter Helper Function - Convert a string to Camel Case */
	export const toCamelCase: typeof import('${virtResolver.textFormatterHelper}').toCamelCase;
    /** Text Formatter Helper Function - Convert a string to Pascal Case */
	export const toPascalCase: typeof import('${virtResolver.textFormatterHelper}').toPascalCase;
    /** Utility Map for declaring StudioCMS Pugins */
	export const pluginList: Map<string, { name: string, label: string }>;
}`);

// Return Virtual DTS File
return studioCMSDTS.text();
}