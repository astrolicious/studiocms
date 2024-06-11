/** Ensure the passed path starts with a leading slash. */
export function ensureLeadingSlash(href: string): string {
    let newhref = href;
	if (newhref[0] !== '/') newhref = `/${newhref}`;
	return newhref;
}

/** Ensure the passed path ends with a trailing slash. */
export function ensureTrailingSlash(href: string): string {
    let newhref = href;
	if (newhref[newhref.length - 1] !== '/') newhref += '/';
	return newhref;
}

/** Ensure the passed path starts and ends with slashes. */
export function ensureLeadingAndTrailingSlashes(href: string): string {
    let newhref = href;
	newhref = ensureLeadingSlash(newhref);
	newhref = ensureTrailingSlash(newhref);
	return newhref;
}

/** Ensure the passed path does not start with a leading slash. */
export function stripLeadingSlash(href: string) {
    let newhref = href;
	if (newhref[0] === '/') newhref = newhref.slice(1);
	return newhref;
}

/** Ensure the passed path does not end with a trailing slash. */
export function stripTrailingSlash(href: string) {
    let newhref = href;
	if (newhref[newhref.length - 1] === '/') newhref = newhref.slice(0, -1);
	return newhref;
}

/** Ensure the passed path does not start and end with slashes. */
export function stripLeadingAndTrailingSlashes(href: string): string {
    let newhref = href;
	newhref = stripLeadingSlash(newhref);
	newhref = stripTrailingSlash(newhref);
	return newhref;
}

/** Remove the extension from a path. */
export function stripHtmlExtension(path: string) {
	const pathWithoutTrailingSlash = stripTrailingSlash(path);
	return pathWithoutTrailingSlash.endsWith('.html') ? pathWithoutTrailingSlash.slice(0, -5) : path;
}

/** Add '.html' extension to a path. */
export function ensureHtmlExtension(path: string) {
    let newpath = path;
	newpath = stripLeadingAndTrailingSlashes(path);
	if (!newpath.endsWith('.html')) {
		newpath = path ? `${path}.html` : '/index.html';
	}
	return ensureLeadingSlash(newpath);
}