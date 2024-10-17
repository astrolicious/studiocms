export function createWindowElement(content: string) {
	const windowElement = document.createElement('astro-dev-toolbar-window');
	windowElement.innerHTML = content;
	// @ts-ignore
	windowElement.placement = 'bottom-center';
	return windowElement;
}

export function closeOnOutsideClick(
	eventTarget: EventTarget,
	additionalCheck?: (target: Element) => boolean
) {
	function onPageClick(event: MouseEvent) {
		const target = event.target as Element | null;
		if (!target) return;
		if (!target.closest) return;
		if (target.closest('astro-dev-toolbar')) return;
		if (additionalCheck?.(target)) return;
		eventTarget.dispatchEvent(
			new CustomEvent('toggle-app', {
				detail: {
					state: false,
				},
			})
		);
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	eventTarget.addEventListener('app-toggled', (event: any) => {
		if (event.detail.state === true) {
			document.addEventListener('click', onPageClick, true);
		} else {
			document.removeEventListener('click', onPageClick, true);
		}
	});
}
