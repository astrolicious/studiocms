// Sidebar link type
/**
 * @param id - The unique identifier for the link
 * @param href - The URL to redirect to
 * @param text - The text to display for the link
 * @param minPermissionLevel - The minimum permission level required to view the link (unknown, visitor, editor, admin)
 * @param icon - The icon to display for the link ( see https://shoelace.style/components/icon )
 */
export type SideBarLink = {
	/** Unique link ID */
	id: string;
	/** URL to redirect to */
	href: string;
	/** Text to display for the link */
	text: string;
	/** Minimum permission level required to view the link (unkown/visitor/editor/admin) */
	minPermissionLevel: string;
	/** Icon to display for the link ( icon: 'data:image/svg+xml;base64,PH...) */
	icon: string;
	/** Type of link (link/dropdown) */
	type: 'link' | 'dropdown';
	/** Dropdown items for dropdown links (Requires `type: 'dropdown'`) */
	dropdownItems?: SideBarLink[];
};

export type DashboardPageLink = {
	/** Label for the link */
	label: string;
	/** URL to redirect to */
	link: string;
	/** Minimum permission level required to view the link (unkown/visitor/editor/admin) */
	minRole: 'unknown' | 'visitor' | 'editor' | 'admin';
	/** Icon to display for the link ( icon: 'data:image/svg+xml;base64,PH...) */
	icon: string;
	/** Type of link (link/dropdown) */
	type: 'link' | 'dropdown';
	/** Dropdown items for dropdown links (Requires `type: 'dropdown'`) */
	dropdownChildren?: DashboardPageLink[];
};

export type StudioCMSPluginOptions = {
	/**
	 * The Package Name of the Plugin
	 */
	pkgname: string;
	/**
	 * The Options for the Plugin
	 */
	opts: {
		/**
		 * The Label for the Plugin used in the Dashboard
		 */
		pluginLabel: string;
		/**
		 * The Front-end Navigation Links for the Plugin
		 */
		navigationLinks?: {
			text: string;
			slug: string;
		}[];
		/**
		 * Custom Dashboard pages for the Plugin
		 */
		dashboardPageLinks?: DashboardPageLink[];
		/**
		 * The Custom Renderer Plugin Path - This is used to replace the built-in Markdown Renderer. Recommended for Advanced Users.
		 */
		customRendererPluginPath?: string;
	};
};
