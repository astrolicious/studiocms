import type { ToastProps } from '../../types';

function toast(props: ToastProps) {
	const createToast = new CustomEvent('createtoast', {
		detail: props,
	});

	document.dispatchEvent(createToast);
}

export { toast };
