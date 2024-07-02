import type { SlIcon } from "astrolace:types";


export interface ThemeChangeEventDetail {
	theme: 'auto' | 'dark' | 'light';
	systemTheme?: 'dark' | 'light';
}

export function setFooterIcon(
    footerIcon: SlIcon,
	theme: ThemeChangeEventDetail['theme'],
	systemTheme?: ThemeChangeEventDetail['systemTheme'],
) {
	if (theme === 'auto') {
		if (systemTheme === 'dark') {
			footerIcon.name = 'logo-light';
		} else {
			footerIcon.name = 'logo-dark';
		}
	}
	if (theme === 'dark') {
		footerIcon.name = 'logo-light';
	}
	if (theme === 'light') {
		footerIcon.name = 'logo-dark';
	}
}