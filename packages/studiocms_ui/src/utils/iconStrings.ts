type ValidIconString =
	| 'check-circle'
	| 'exclamation-triangle'
	| 'exclamation-circle'
	| 'information-circle'
	| 'x-mark';

const iconStrings: Record<ValidIconString, string> = {
	'check-circle':
		'<svg xmlns="http://www.w3.org/2000/svg" class="%class%" width="%width%" height="%height%" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
	'exclamation-circle':
		'<svg xmlns="http://www.w3.org/2000/svg" class="%class%" width="%width%" height="%height%" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>',
	'information-circle':
		'<svg xmlns="http://www.w3.org/2000/svg" class="%class%" width="%width%" height="%height%" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
	'x-mark':
		'<svg xmlns="http://www.w3.org/2000/svg" class="%class%" width="%width%" height="%height%"  fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>',
	'exclamation-triangle':
		'<svg xmlns="http://www.w3.org/2000/svg" class="%class%" width="%width%" height="%height%" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
};

function getIconString(icon: ValidIconString, classes: string, width: number, height: number) {
	return iconStrings[icon]
		.replace('%class%', classes)
		.replace('%width%', width.toString())
		.replace('%height%', height.toString());
}

export { getIconString };
export type { ValidIconString };
