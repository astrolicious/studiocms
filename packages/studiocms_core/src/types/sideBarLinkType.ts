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
