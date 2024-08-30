import { stripLeadingSlash, stripTrailingSlash } from './path';

const base = stripTrailingSlash(import.meta.env.BASE_URL);

/** Get the a root-relative URL path with the site’s `base` prefixed. */
export function pathWithBase(path: string) {
	let newpath = path;
	newpath = stripLeadingSlash(newpath);
	return newpath ? `${base}/${newpath}` : `${base}/`;
}

/** Get the a root-relative file URL path with the site’s `base` prefixed. */
export function fileWithBase(path: string) {
	let newpath = path;
	newpath = stripLeadingSlash(newpath);
	return newpath ? `${base}/${newpath}` : base;
}
