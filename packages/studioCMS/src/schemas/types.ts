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
	/** Minimum permission level required to view the link (unknown/visitor/editor/admin) */
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
	/** Minimum permission level required to view the link (unknown/visitor/editor/admin) */
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
	 * The package name of the plugin
	 */
	pkgname: string;
	/**
	 * The options for the plugin
	 */
	opts: {
		/**
		 * The label for the plugin (used in the dashboard)
		 */
		pluginLabel: string;
		/**
		 * The front-end navigation links for the plugin
		 */
		navigationLinks?: {
			text: string;
			slug: string;
		}[];
		/**
		 * Custom dashboard pages for the plugin
		 */
		dashboardPageLinks?: DashboardPageLink[];
		/**
		 * The custom renderer plugin path - This is used to replace the built-in Markdown renderer. Recommended for advanced users.
		 */
		customRendererPluginPath?: string;
	};
};
