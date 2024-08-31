import { fileFactory } from '@matthiesenxyz/integration-utils/fileFactory';

/**
 * Generate a d.ts file for the StudioCMS Core Components and Helpers
 *
 * @param components
 * @param helpers
 * @returns string - to be used with injectTypes in the Astro Integration
 */
export const dtsFile = (
	components: {
		Avatar: string;
		FormattedDate: string;
		Genericheader: string;
		Navigation: string;
	},
	helpers: {
		authHelper: string;
		urlGenFactory: string;
		formatters: string;
		pathGenerators: string;
		contentHelper: string;
		headDefaults: string;
	}
) => {
	// Create a new file for the core.d.ts file
	const DTSFile = fileFactory();

	// Start of the components module
	DTSFile.addLines(`declare module 'studiocms:components' {`);

	// Add the Avatar component to the module
	DTSFile.addLines(`
    /** 
     * # Avatar Component used for the Navigation Component 
     * 
     * This component has no props and will render the current user avatar or a default avatar if no user is logged in based on the Astro.locals object
    */
    export const Avatar: typeof import('${components.Avatar}').default`);

	// Add the FormattedDate component to the module
	DTSFile.addLines(`
    /** 
     * # Formatted Date Component used for rendering dates in a human readable format 
     * 
     * This components locale will adapt to the current configuration of the StudioCMS 'dateLocale' settings configuration option.
     * 
     * @props {string(Date)} date - Date String
    */
    export const FormattedDate: typeof import('${components.FormattedDate}').default;`);

	// Add the GenericHeader component to the module
	DTSFile.addLines(`
    /**
     * # Generic Header Component <Genericheader />
     * 
     * Generic Header Component used for rendering a generic header with a title and description from StudioCMS
    */
    export const Genericheader: typeof import('${components.Genericheader}').default;`);

	// Add the NavigationBar component to the module
	DTSFile.addLines(`
    /** 
     * # Navigation Component used for rendering StudioCMS User Facing Navigation
     * 
     * This component is a helper component that will render the StudioCMS user facing navigation to assist in easy navigation of your built front-end site
     * 
     * @props {topLevelLinkCount} number - Number of top level links to display before collapsing into a dropdown
     * @props {hideAvatar} boolean - Hide the user avatar/Login button in the navigation bar
    */
    export const Navigation: typeof import('${components.Navigation}').default;`);

	// End of the components module
	DTSFile.addLines('}');

	// Start of the helpers modules
	DTSFile.addLines(`declare module 'studiocms:helpers' {`);

	// Add the authHelper helper to the module
	DTSFile.addLines(`
    /** 
     * # Auth Helper Function
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
    export const authHelper: typeof import('${helpers.authHelper}').default;`);

	// Add the urlGenFactory helper to the module
	DTSFile.addLines(`
    /** 
     * # URL Generation Helper Function
     * 
     * @param {boolean} isDashboardRoute - Is this a dashboard route?
     * @param {string} path - The path to generate the URL for
     * @param {string} DashboardRoute - The dashboard route to use (Default: 'dashboard')
    */
    export const urlGenFactory: typeof import('${helpers.urlGenFactory}').default;`);

	// Add the Text Formatters helpers to the module
	DTSFile.addLines(`
    /** # Text Formatter Helper Function - Convert a string to Camel Case */
    export const toCamelCase: typeof import('${helpers.formatters}').toCamelCase;`);

	DTSFile.addLines(`
    /** # Text Formatter Helper Function - Convert a string to Pascal Case */
    export const toPascalCase: typeof import('${helpers.formatters}').toPascalCase;`);

	// Add the Path Generators helpers to the module
	DTSFile.addLines(`
    /**
     * # pathWithBase Helper Function
     * 
     * Get the a root-relative URL path with the site's 'base' prefixed.
     */
    export const pathWithBase: typeof import('${helpers.pathGenerators}').pathWithBase;`);

	DTSFile.addLines(`
    /**
     * # fileWithBase Helper Function
     * 
     * Get the a root-relative file URL path with the site's 'base' prefixed.
    */
    export const fileWithBase: typeof import('${helpers.pathGenerators}').fileWithBase;`);

	// End of the helpers module
	DTSFile.addLines('}');

	// Add the ContentHelper module
	DTSFile.addLines(`declare module 'studiocms:helpers/contentHelper' {`);

	// Main contentHelper function
	DTSFile.addLines(`
    /**
     * # A helper function to get the content of a page by its slug.
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
    export const contentHelper: typeof import('${helpers.contentHelper}').contentHelper;`);

	// getSiteConfig function
	DTSFile.addLines(`
    /**
     * # Site Configuration helper function to get the site configuration data from Astro Studio's Database.
     * 
     * @returns The site configuration data. (Title, Description)
    */
    export const getSiteConfig: typeof import('${helpers.contentHelper}').getSiteConfig;`);

	// getPageList function
	DTSFile.addLines(`
    /**
     * # Get page list helper function to get a list of all pages from Astro Studio's database.
     * 
     * @returns A Array of all pages in the database in ascending order of their published date.
    */
    export const getPageList: typeof import('${helpers.contentHelper}').getPageList;`);

	// getUserList function
	DTSFile.addLines(`
    /**
     * # Get user list helper function to get a list of all users from Astro Studio's Database.
     * 
     * @returns A Array of all users in the database.
    */
    export const getUserList: typeof import('${helpers.contentHelper}').getUserList;`);

	// getUserById function
	DTSFile.addLines(`
    /**
     * # Get user by ID helper function to get a user by their ID from Astro Studio's Database.
     * 
     * @param userId The ID of the user to get. You can get this from 'Astro.locals.dbUser.id' when StudioCMS Auth middleware is used.
     * @returns The user data.
    */
    export const getUserById: typeof import('${helpers.contentHelper}').getUserById;`);

	// ContentHelperTempResponse type
	DTSFile.addLines(`
    /** 
     * # Content Helper Temp Response Type 
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
    export type ContentHelperTempResponse = import('${helpers.contentHelper}').ContentHelperTempResponse;`);

	// SiteConfigResponse type
	DTSFile.addLines(`
    /** 
     * # Site Config Response Type 
     * 
     * type SiteConfigResponse = {
     *   title: string;
     *   id: number;
     *   description: string;
     * }
    */
    export type SiteConfigResponse = import('${helpers.contentHelper}').SiteConfigResponse;`);

	// pageDataReponse type
	DTSFile.addLines(`
    /** 
     * # Page Data Response Type
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
    export type pageDataReponse = import('${helpers.contentHelper}').pageDataReponse;`);

	// UserResponse type
	DTSFile.addLines(`
    /** 
     * # User Response Type
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
    export type UserResponse = import('${helpers.contentHelper}').UserResponse;`);

	// End of the contentHelper module
	DTSFile.addLines('}');

	// Add the headDefaults module
	DTSFile.addLines(`declare module 'studiocms:helpers/headDefaults' {`);

	// headDefaults function
	DTSFile.addLines(`
    /**
     * # Default Head Configuration
     * 
     * A helper function to get the default head configuration for a page.
    */
    export const headDefaults: typeof import('${helpers.headDefaults}').headDefaults;`);

	// End of the headDefaults module
	DTSFile.addLines('}');

	// Return the DTS File
	return DTSFile.text();
};
