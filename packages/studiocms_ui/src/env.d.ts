/// <reference path="../.astro/types.d.ts" />

import type { ToastProps } from './types';

interface CustomEventMap {
	createtoast: CustomEvent<ToastProps>;
}

declare global {
	interface Document {
		addEventListener<K extends keyof CustomEventMap>(
			type: K,
			listener: (this: Document, ev: CustomEventMap[K]) => void
		): void;
		dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
	}
}
