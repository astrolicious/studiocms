import { urlGenFactory } from 'studiocms:helpers';
import Config from 'virtual:studiocms/config';
import { dashboardPageLinks } from 'virtual:studiocms/_pluginDashboardLinks';

const {
	dashboardConfig: { dashboardRouteOverride },
} = Config;

export async function getSluggedRoute(url: string, slug: string): Promise<string> {
	return await urlGenFactory(true, url + slug, dashboardRouteOverride);
}

export async function getEditRoute(slug: string): Promise<string> {
	return await getSluggedRoute('edit/pages/', slug);
}

export async function getDeleteRoute(slug: string): Promise<string> {
	return await getSluggedRoute('delete/pages/', slug);
}

export async function makeNonDashboardRoute(route?: string | undefined): Promise<string> {
	return await urlGenFactory(false, route);
}

export async function makeDashboardRoute(route?: string | undefined): Promise<string> {
	return await urlGenFactory(true, route, dashboardRouteOverride);
}

export async function makeAPIDashboardRoute(route: string): Promise<string> {
	return await urlGenFactory(true, `api/${route}`, dashboardRouteOverride);
}

export const StudioCMSRoutes = {
	mainLinks: {
		baseSiteURL: await makeNonDashboardRoute(),
		dashboardIndex: await makeDashboardRoute(),
		userProfile: await makeDashboardRoute('profile/'),
		pageNew: await makeDashboardRoute('new/page/'),
		pageEdit: await makeDashboardRoute('page-list/'),
		siteConfiguration: await makeDashboardRoute('configuration/'),
		livePreviewBox: await makeAPIDashboardRoute('liverender'),
		configurationAdmins: await makeDashboardRoute('configuration/admins/'),
	},
	authLinks: {
		loginURL: await makeDashboardRoute('login'),
		logoutURL: await makeDashboardRoute('logout'),
		signupURL: await makeDashboardRoute('signup/'),
		loginAPI: await makeDashboardRoute('login/api/login'),
		registerAPI: await makeDashboardRoute('login/api/register'),
		githubIndex: await makeDashboardRoute('login/github'),
		githubCallback: await makeDashboardRoute('login/github/callback'),
		discordIndex: await makeDashboardRoute('login/discord'),
		discordCallback: await makeDashboardRoute('login/discord/callback'),
		googleIndex: await makeDashboardRoute('login/google'),
		googleCallback: await makeDashboardRoute('login/google/callback'),
		auth0Index: await makeDashboardRoute('login/auth0'),
		auth0Callback: await makeDashboardRoute('login/auth0/callback'),
	},
	endpointLinks: {
		config: {
			siteConfig: await makeAPIDashboardRoute('config/site'),
			adminConfig: await makeAPIDashboardRoute('config/admin'),
		},
		pages: {
			createPages: await makeAPIDashboardRoute('pages/create'),
			editPages: await makeAPIDashboardRoute('pages/edit'),
			deletePages: await makeAPIDashboardRoute('pages/delete'),
		},
	},
};

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

// Add default dashboard page links
const defaultDashboardPageLinks: SideBarLink[] = [
	{
		id: 'home',
		href: StudioCMSRoutes.mainLinks.baseSiteURL,
		text: 'View Site',
		minPermissionLevel: 'unknown',
		icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik04IDBhOCA4IDAgMSAwIDAgMTZBOCA4IDAgMCAwIDggME0yLjA0IDQuMzI2Yy4zMjUgMS4zMjkgMi41MzIgMi41NCAzLjcxNyAzLjE5Yy40OC4yNjMuNzkzLjQzNC43NDMuNDg0cS0uMTIxLjEyLS4yNDIuMjM0Yy0uNDE2LjM5Ni0uNzg3Ljc0OS0uNzU4IDEuMjY2Yy4wMzUuNjM0LjYxOC44MjQgMS4yMTQgMS4wMTdjLjU3Ny4xODggMS4xNjguMzggMS4yODYuOTgzYy4wODIuNDE3LS4wNzUuOTg4LS4yMiAxLjUyYy0uMjE1Ljc4Mi0uNDA2IDEuNDguMjIgMS40OGMxLjUtLjUgMy43OTgtMy4xODYgNC01Yy4xMzgtMS4yNDMtMi0yLTMuNS0yLjVjLS40NzgtLjE2LS43NTUuMDgxLS45OS4yODRjLS4xNzIuMTUtLjMyMi4yNzktLjUxLjIxNmMtLjQ0NS0uMTQ4LTIuNS0yLTEuNS0yLjVjLjc4LS4zOS45NTItLjE3MSAxLjIyNy4xODJjLjA3OC4wOTkuMTYzLjIwOC4yNzMuMzE4Yy42MDkuMzA0LjY2Mi0uMTMyLjcyMy0uNjMzYy4wMzktLjMyMi4wODEtLjY3MS4yNzctLjg2N2MuNDM0LS40MzQgMS4yNjUtLjc5MSAyLjAyOC0xLjEyYy43MTItLjMwNiAxLjM2NS0uNTg3IDEuNTc5LS44OEE3IDcgMCAxIDEgMi4wNCA0LjMyN1oiLz48L3N2Zz4=',
		type: 'link',
	},
	{
		id: 'dashboard',
		href: StudioCMSRoutes.mainLinks.dashboardIndex,
		text: 'Dashboard',
		minPermissionLevel: 'visitor',
		icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik02IDF2M0gxVjF6TTEgMGExIDEgMCAwIDAtMSAxdjNhMSAxIDAgMCAwIDEgMWg1YTEgMSAwIDAgMCAxLTFWMWExIDEgMCAwIDAtMS0xem0xNCAxMnYzaC01di0zem0tNS0xYTEgMSAwIDAgMC0xIDF2M2ExIDEgMCAwIDAgMSAxaDVhMSAxIDAgMCAwIDEtMXYtM2ExIDEgMCAwIDAtMS0xek02IDh2N0gxVjh6TTEgN2ExIDEgMCAwIDAtMSAxdjdhMSAxIDAgMCAwIDEgMWg1YTEgMSAwIDAgMCAxLTFWOGExIDEgMCAwIDAtMS0xem0xNC02djdoLTVWMXptLTUtMWExIDEgMCAwIDAtMSAxdjdhMSAxIDAgMCAwIDEgMWg1YTEgMSAwIDAgMCAxLTFWMWExIDEgMCAwIDAtMS0xeiIvPjwvc3ZnPg==',
		type: 'link',
	},
	{
		id: 'profile',
		href: StudioCMSRoutes.mainLinks.userProfile,
		text: 'User Profile',
		minPermissionLevel: 'visitor',
		icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik0xMSA2YTMgMyAwIDEgMS02IDBhMyAzIDAgMCAxIDYgMCIvPjxwYXRoIGQ9Ik0yIDBhMiAyIDAgMCAwLTIgMnYxMmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWMmEyIDIgMCAwIDAtMi0yem0xMiAxYTEgMSAwIDAgMSAxIDF2MTJhMSAxIDAgMCAxLTEgMXYtMWMwLTEtMS00LTYtNHMtNiAzLTYgNHYxYTEgMSAwIDAgMS0xLTFWMmExIDEgMCAwIDEgMS0xeiIvPjwvZz48L3N2Zz4=',
		type: 'link',
	},
	{
		id: 'new-page',
		href: StudioCMSRoutes.mainLinks.pageNew,
		text: 'Create New Page',
		minPermissionLevel: 'editor',
		icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik0xNS41MDIgMS45NGEuNS41IDAgMCAxIDAgLjcwNkwxNC40NTkgMy42OWwtMi0yTDEzLjUwMi42NDZhLjUuNSAwIDAgMSAuNzA3IDBsMS4yOTMgMS4yOTN6bS0xLjc1IDIuNDU2bC0yLTJMNC45MzkgOS4yMWEuNS41IDAgMCAwLS4xMjEuMTk2bC0uODA1IDIuNDE0YS4yNS4yNSAwIDAgMCAuMzE2LjMxNmwyLjQxNC0uODA1YS41LjUgMCAwIDAgLjE5Ni0uMTJsNi44MTMtNi44MTR6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMSAxMy41QTEuNSAxLjUgMCAwIDAgMi41IDE1aDExYTEuNSAxLjUgMCAwIDAgMS41LTEuNXYtNmEuNS41IDAgMCAwLTEgMHY2YS41LjUgMCAwIDEtLjUuNWgtMTFhLjUuNSAwIDAgMS0uNS0uNXYtMTFhLjUuNSAwIDAgMSAuNS0uNUg5YS41LjUgMCAwIDAgMC0xSDIuNUExLjUgMS41IDAgMCAwIDEgMi41eiIvPjwvZz48L3N2Zz4=',
		type: 'link',
	},
	{
		id: 'edit-pages',
		href: StudioCMSRoutes.mainLinks.pageEdit,
		text: 'Edit Pages',
		minPermissionLevel: 'editor',
		icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMi4xNDYuMTQ2YS41LjUgMCAwIDEgLjcwOCAwbDMgM2EuNS41IDAgMCAxIDAgLjcwOGwtMTAgMTBhLjUuNSAwIDAgMS0uMTY4LjExbC01IDJhLjUuNSAwIDAgMS0uNjUtLjY1bDItNWEuNS41IDAgMCAxIC4xMS0uMTY4ek0xMS4yMDcgMi41TDEzLjUgNC43OTNMMTQuNzkzIDMuNUwxMi41IDEuMjA3em0xLjU4NiAzTDEwLjUgMy4yMDdMNCA5LjcwN1YxMGguNWEuNS41IDAgMCAxIC41LjV2LjVoLjVhLjUuNSAwIDAgMSAuNS41di41aC4yOTN6bS05Ljc2MSA1LjE3NWwtLjEwNi4xMDZsLTEuNTI4IDMuODIxbDMuODIxLTEuNTI4bC4xMDYtLjEwNkEuNS41IDAgMCAxIDUgMTIuNVYxMmgtLjVhLjUuNSAwIDAgMS0uNS0uNVYxMWgtLjVhLjUuNSAwIDAgMS0uNDY4LS4zMjUiLz48L3N2Zz4=',
		type: 'link',
	},
	{
		id: 'site-config',
		href: StudioCMSRoutes.mainLinks.siteConfiguration,
		text: 'Site Configuration',
		minPermissionLevel: 'admin',
		icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik03LjA2OC43MjdjLjI0My0uOTcgMS42Mi0uOTcgMS44NjQgMGwuMDcxLjI4NmEuOTYuOTYgMCAwIDAgMS42MjIuNDM0bC4yMDUtLjIxMWMuNjk1LS43MTkgMS44ODgtLjAzIDEuNjEzLjkzMWwtLjA4LjI4NGEuOTYuOTYgMCAwIDAgMS4xODcgMS4xODdsLjI4My0uMDgxYy45Ni0uMjc1IDEuNjUuOTE4LjkzMSAxLjYxM2wtLjIxMS4yMDVhLjk2Ljk2IDAgMCAwIC40MzQgMS42MjJsLjI4Ni4wNzFjLjk3LjI0My45NyAxLjYyIDAgMS44NjRsLS4yODYuMDcxYS45Ni45NiAwIDAgMC0uNDM0IDEuNjIybC4yMTEuMjA1Yy43MTkuNjk1LjAzIDEuODg4LS45MzEgMS42MTNsLS4yODQtLjA4YS45Ni45NiAwIDAgMC0xLjE4NyAxLjE4N2wuMDgxLjI4M2MuMjc1Ljk2LS45MTggMS42NS0xLjYxMy45MzFsLS4yMDUtLjIxMWEuOTYuOTYgMCAwIDAtMS42MjIuNDM0bC0uMDcxLjI4NmMtLjI0My45Ny0xLjYyLjk3LTEuODY0IDBsLS4wNzEtLjI4NmEuOTYuOTYgMCAwIDAtMS42MjItLjQzNGwtLjIwNS4yMTFjLS42OTUuNzE5LTEuODg4LjAzLTEuNjEzLS45MzFsLjA4LS4yODRhLjk2Ljk2IDAgMCAwLTEuMTg2LTEuMTg3bC0uMjg0LjA4MWMtLjk2LjI3NS0xLjY1LS45MTgtLjkzMS0xLjYxM2wuMjExLS4yMDVhLjk2Ljk2IDAgMCAwLS40MzQtMS42MjJsLS4yODYtLjA3MWMtLjk3LS4yNDMtLjk3LTEuNjIgMC0xLjg2NGwuMjg2LS4wNzFhLjk2Ljk2IDAgMCAwIC40MzQtMS42MjJsLS4yMTEtLjIwNWMtLjcxOS0uNjk1LS4wMy0xLjg4OC45MzEtMS42MTNsLjI4NC4wOGEuOTYuOTYgMCAwIDAgMS4xODctMS4xODZsLS4wODEtLjI4NGMtLjI3NS0uOTYuOTE4LTEuNjUgMS42MTMtLjkzMWwuMjA1LjIxMWEuOTYuOTYgMCAwIDAgMS42MjItLjQzNHpNMTIuOTczIDguNUg4LjI1bC0yLjgzNCAzLjc3OUE0Ljk5OCA0Ljk5OCAwIDAgMCAxMi45NzMgOC41bTAtMWE0Ljk5OCA0Ljk5OCAwIDAgMC03LjU1Ny0zLjc3OWwyLjgzNCAzLjc4ek01LjA0OCAzLjk2N2wtLjA4Ny4wNjV6bS0uNDMxLjM1NUE0Ljk4IDQuOTggMCAwIDAgMy4wMDIgOGMwIDEuNDU1LjYyMiAyLjc2NSAxLjYxNSAzLjY3OEw3LjM3NSA4em0uMzQ0IDcuNjQ2bC4wODcuMDY1eiIvPjwvc3ZnPg==',
		type: 'link',
	},
];

// Add custom dashboard page links
const customDashboardPageLinks: SideBarLink[] = [];

const customDashboardRoutes = Array.from(dashboardPageLinks.values());

for (const links of customDashboardRoutes) {
	customDashboardPageLinks.push(...links);
}

const customDashboardDropdown = {
	id: 'integrations',
	href: '',
	text: 'Integration Configs',
	minPermissionLevel: 'editor',
	icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0zLjExMiAzLjY0NUExLjUgMS41IDAgMCAxIDQuNjA1IDJIN2EuNS41IDAgMCAxIC41LjV2LjM4MmMwIC42OTYtLjQ5NyAxLjE4Mi0uODcyIDEuNDY5YS41LjUgMCAwIDAtLjExNS4xMThsLS4wMTIuMDI1TDYuNSA0LjV2LjAwM2wuMDAzLjAxcS4wMDUuMDE1LjAzNi4wNTNhLjkuOSAwIDAgMCAuMjcuMTk0QzcuMDkgNC45IDcuNTEgNSA4IDVjLjQ5MiAwIC45MTItLjEgMS4xOS0uMjRhLjkuOSAwIDAgMCAuMjcxLS4xOTRhLjIuMiAwIDAgMCAuMDM5LS4wNjN2LS4wMDlsLS4wMTItLjAyNWEuNS41IDAgMCAwLS4xMTUtLjExOGMtLjM3NS0uMjg3LS44NzItLjc3My0uODcyLTEuNDY5VjIuNUEuNS41IDAgMCAxIDkgMmgyLjM5NWExLjUgMS41IDAgMCAxIDEuNDkzIDEuNjQ1TDEyLjY0NSA2LjVoLjIzN2MuMTk1IDAgLjQyLS4xNDcuNjc1LS40OGMuMjEtLjI3NC41MjgtLjUyLjk0My0uNTJjLjU2OCAwIC45NDcuNDQ3IDEuMTU0Ljg2MkMxNS44NzcgNi44MDcgMTYgNy4zODcgMTYgOHMtLjEyMyAxLjE5My0uMzQ2IDEuNjM4Yy0uMjA3LjQxNS0uNTg2Ljg2Mi0xLjE1NC44NjJjLS40MTUgMC0uNzMzLS4yNDYtLjk0My0uNTJjLS4yNTUtLjMzMy0uNDgtLjQ4LS42NzUtLjQ4aC0uMjM3bC4yNDMgMi44NTVBMS41IDEuNSAwIDAgMSAxMS4zOTUgMTRIOWEuNS41IDAgMCAxLS41LS41di0uMzgyYzAtLjY5Ni40OTctMS4xODIuODcyLTEuNDY5YS41LjUgMCAwIDAgLjExNS0uMTE4bC4wMTItLjAyNWwuMDAxLS4wMDZ2LS4wMDNhLjIuMiAwIDAgMC0uMDM5LS4wNjRhLjkuOSAwIDAgMC0uMjctLjE5M0M4LjkxIDExLjEgOC40OSAxMSA4IDExcy0uOTEyLjEtMS4xOS4yNGEuOS45IDAgMCAwLS4yNzEuMTk0YS4yLjIgMCAwIDAtLjAzOS4wNjN2LjAwM2wuMDAxLjAwNmwuMDEyLjAyNWMuMDE2LjAyNy4wNS4wNjguMTE1LjExOGMuMzc1LjI4Ny44NzIuNzczLjg3MiAxLjQ2OXYuMzgyYS41LjUgMCAwIDEtLjUuNUg0LjYwNWExLjUgMS41IDAgMCAxLTEuNDkzLTEuNjQ1TDMuMzU2IDkuNWgtLjIzOGMtLjE5NSAwLS40Mi4xNDctLjY3NS40OGMtLjIxLjI3NC0uNTI4LjUyLS45NDMuNTJjLS41NjggMC0uOTQ3LS40NDctMS4xNTQtLjg2MkMuMTIzIDkuMTkzIDAgOC42MTMgMCA4cy4xMjMtMS4xOTMuMzQ2LTEuNjM4Qy41NTMgNS45NDcuOTMyIDUuNSAxLjUgNS41Yy40MTUgMCAuNzMzLjI0Ni45NDMuNTJjLjI1NS4zMzMuNDguNDguNjc1LjQ4aC4yMzh6TTQuNjA1IDNhLjUuNSAwIDAgMC0uNDk4LjU1bC4wMDEuMDA3bC4yOSAzLjRBLjUuNSAwIDAgMSAzLjkgNy41aC0uNzgyYy0uNjk2IDAtMS4xODItLjQ5Ny0xLjQ2OS0uODcyYS41LjUgMCAwIDAtLjExOC0uMTE1bC0uMDI1LS4wMTJMMS41IDYuNWgtLjAwM2EuMi4yIDAgMCAwLS4wNjQuMDM5YS45LjkgMCAwIDAtLjE5My4yN0MxLjEgNy4wOSAxIDcuNTEgMSA4cy4xLjkxMi4yNCAxLjE5Yy4wNy4xNC4xNC4yMjUuMTk0LjI3MWEuMi4yIDAgMCAwIC4wNjMuMDM5SDEuNWwuMDA2LS4wMDFsLjAyNS0uMDEyYS41LjUgMCAwIDAgLjExOC0uMTE1Yy4yODctLjM3NS43NzMtLjg3MiAxLjQ2OS0uODcySDMuOWEuNS41IDAgMCAxIC40OTguNTQybC0uMjkgMy40MDhhLjUuNSAwIDAgMCAuNDk3LjU1aDEuODc4Yy0uMDQ4LS4xNjYtLjE5NS0uMzUyLS40NjMtLjU1N2MtLjI3NC0uMjEtLjUyLS41MjgtLjUyLS45NDNjMC0uNTY4LjQ0Ny0uOTQ3Ljg2Mi0xLjE1NEM2LjgwNyAxMC4xMjMgNy4zODcgMTAgOCAxMHMxLjE5My4xMjMgMS42MzguMzQ2Yy40MTUuMjA3Ljg2Mi41ODYuODYyIDEuMTU0YzAgLjQxNS0uMjQ2LjczMy0uNTIuOTQzYy0uMjY4LjIwNS0uNDE1LjM5LS40NjMuNTU3aDEuODc4YS41LjUgMCAwIDAgLjQ5OC0uNTVsLS4wMDEtLjAwN2wtLjI5LTMuNEEuNS41IDAgMCAxIDEyLjEgOC41aC43ODJjLjY5NiAwIDEuMTgyLjQ5NyAxLjQ2OS44NzJjLjA1LjA2NS4wOTEuMDk5LjExOC4xMTVsLjAyNS4wMTJsLjAwNi4wMDFoLjAwM2EuMi4yIDAgMCAwIC4wNjQtLjAzOWEuOS45IDAgMCAwIC4xOTMtLjI3Yy4xNC0uMjguMjQtLjcuMjQtMS4xOTFzLS4xLS45MTItLjI0LTEuMTlhLjkuOSAwIDAgMC0uMTk0LS4yNzFhLjIuMiAwIDAgMC0uMDYzLS4wMzlIMTQuNWwtLjAwNi4wMDFsLS4wMjUuMDEyYS41LjUgMCAwIDAtLjExOC4xMTVjLS4yODcuMzc1LS43NzMuODcyLTEuNDY5Ljg3MkgxMi4xYS41LjUgMCAwIDEtLjQ5OC0uNTQzbC4yOS0zLjQwN2EuNS41IDAgMCAwLS40OTctLjU1SDkuNTE3Yy4wNDguMTY2LjE5NS4zNTIuNDYzLjU1N2MuMjc0LjIxLjUyLjUyOC41Mi45NDNjMCAuNTY4LS40NDcuOTQ3LS44NjIgMS4xNTRDOS4xOTMgNS44NzcgOC42MTMgNiA4IDZzLTEuMTkzLS4xMjMtMS42MzgtLjM0NkM1Ljk0NyA1LjQ0NyA1LjUgNS4wNjggNS41IDQuNWMwLS40MTUuMjQ2LS43MzMuNTItLjk0M2MuMjY4LS4yMDUuNDE1LS4zOS40NjMtLjU1N3oiLz48L3N2Zz4=',
	type: 'dropdown',
	dropdownItems: customDashboardPageLinks,
} satisfies SideBarLink;

// Side bar links map
const finalSideBarLinkMap: SideBarLink[] = [...defaultDashboardPageLinks];

// Merge custom dashboard page links
if (customDashboardDropdown.dropdownItems.length > 0) {
	finalSideBarLinkMap.push(customDashboardDropdown);
}

export const sideBarLinkMap: SideBarLink[] = finalSideBarLinkMap;
