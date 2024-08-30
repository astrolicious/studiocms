import { PLUGIN_INTEGRATION_ICON } from '../constVars';
import type { DashboardPageLink, SideBarLink } from '../schemas/types';

export function convertDashboardLinksType(
	dashboardPageLinks: DashboardPageLink[],
	pkgname: string,
	pluginLabel: string
): SideBarLink[] {
	const toReturn: SideBarLink[] = [];

	const dashboardPageLinksArray: SideBarLink[] = [];

	for (const linkItem of dashboardPageLinks) {
		const { type } = linkItem;

		// If the type is a regular link
		if (type === 'link') {
			const { icon, label, link, minRole } = linkItem;

			dashboardPageLinksArray.push({
				id: `${pkgname}-${label}`,
				href: link,
				text: label,
				minPermissionLevel: minRole,
				icon: icon,
				type: 'link',
			});
		}

		// If the type is a dropdown
		if (type === 'dropdown') {
			const { icon, label, link, minRole, type, dropdownChildren } = linkItem;

			const DropdownChildren: SideBarLink[] = [];

			if (dropdownChildren) {
				for (const childItem of dropdownChildren) {
					const { icon, label, link, minRole, type } = childItem;

					DropdownChildren.push({
						id: `${pkgname}-${label}`,
						href: link,
						text: label,
						minPermissionLevel: minRole,
						icon: icon,
						type: type,
					});
				}
			}

			dashboardPageLinksArray.push({
				id: `${pkgname}-${label}`,
				href: link,
				text: label,
				minPermissionLevel: minRole,
				icon: icon,
				type: type,
				dropdownItems: DropdownChildren,
			});
		}
	}

	toReturn.push({
		id: `${pkgname}-dashboard`,
		href: '',
		text: pluginLabel,
		minPermissionLevel: 'visitor',
		icon: PLUGIN_INTEGRATION_ICON,
		type: 'dropdown',
		dropdownItems: dashboardPageLinksArray,
	});

	return toReturn;
}
