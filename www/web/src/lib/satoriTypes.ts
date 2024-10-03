import type { Resvg } from '@resvg/resvg-js';
import type satori from 'satori';

// Types for SatoriAstroOG (Based on florian-lefebvre's Satori-astro)

type SatoriParameters = Parameters<typeof satori>;
type SatoriOptions = SatoriParameters[1];
type ResvgOptions = NonNullable<ConstructorParameters<typeof Resvg>[1]>;
interface VNode {
	type: string;
	props: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		style?: Record<string, any>;
		children?: string | VNode | VNode[];
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		[prop: string]: any;
	};
}
export type SatoriAstroOGOptions = {
	/**
	 * The element passed to `satori`. If you don't use React, make sure
	 * to have a look at https://github.com/natemoo-re/satori-html.
	 */
	template: SatoriParameters[0] | VNode;
	/**
	 * The image width
	 */
	width: number;
	/**
	 * The image height
	 */
	height: number;
};

/**
 * Options forwarded to satori, except for `width` and `height` which
 * come from `satoriAstroOG`.
 */
export type ToSvgOptions = Omit<SatoriOptions, 'width' | 'height'>;

/**
 * Options forwarded to satori and resvg.
 */
export type ToImageOptions = {
	/**
	 * Options forwarded to satori, except for `width` and `height` which
	 * come from `satoriAstroOG`.
	 */
	satori: ToSvgOptions;
	/**
	 * Options forwarded to resvg. If you want to set another size than the
	 * one used by satori (which is unlikely), you can pass a function that
	 * accepts width and height as arguments.
	 */
	resvg?: ResvgOptions | ((params: { width: number; height: number }) => ResvgOptions);
};

export type ToResponseOptions = ToImageOptions & {
	/**
	 * You can alter the response returned by the function. Alternatively, get
	 * the response and modify it before returning it from the endpoint.
	 */
	response?: ResponseInit;
};
