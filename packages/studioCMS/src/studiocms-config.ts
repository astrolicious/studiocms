import type { StudioCMSOptions } from "./schemas";

/**
 * Returns a URL to the optional StudioCMS config file in the Astro project root.
 */
export function getStudioConfigFileUrl(projectRootUrl: URL | string) {
	return new URL('./studiocms.config.mjs', projectRootUrl)
}

/**
 * Attempts to import an StudioCMS  config file in the Astro project root and returns its default export.
 *
 * If no config file is found, an empty object is returned.
 */
export async function loadStudioCMSConfigFile(projectRootUrl: URL | string): Promise<StudioCMSOptions> {
	const pathsToTry = [
		// This path works in most scenarios, but not when the integration is processed by Vite
		// due to a Vite bug affecting import URLs using the "file:" protocol
		new URL(`./studiocms.config.mjs?t=${Date.now()}`, projectRootUrl).href,
	]
	// Detect if the integration is processed by Vite
	if (import.meta.env?.BASE_URL?.length) {
		// Add a fallback path starting with "/", which Vite treats as relative to the project root
		pathsToTry.push(`/studiocms.config.mjs?t=${Date.now()}`)
	}
	/**
	 * Checks the error received on attempting to import StudioCMS config file.
	 * Bun's choice to throw ResolveMessage for import resolver messages means
	 * type comparison (error instanceof Error) isn't portable.
	 * @param error Error object, which could be string, Error, or ResolveMessage.
	 * @returns object containing message and, if present, error code.
	 */
	function coerceError(error: unknown): { message: string; code?: string | undefined } {
		if (typeof error === 'object' && error !== null && 'message' in error) {
			return error as { message: string; code?: string | undefined }
		}
		return { message: error as string }
	}
	for (const path of pathsToTry) {
		try {
			const module = (await import(/* @vite-ignore */ path)) as { default: StudioCMSOptions }
			if (!module.default) {
				throw new Error('Missing or invalid default export. Please export your StudioCMS config object as the default export.')
			}
			return module.default
		} catch (error) {
			const { message, code } = coerceError(error)
			// If the config file was not found, continue with the next path (if any)
			if (code === 'ERR_MODULE_NOT_FOUND' || code === 'ERR_LOAD_URL') {
				// Ignore the error only if the config file itself was not found,
				// not if the config file failed to import another module
				if (message.replace(/(imported )?from .*$/, '').includes('studiocms.config.mjs')) continue
			}
			// If the config file exists, but there was a problem loading it, rethrow the error
			throw new Error(
				`Your project includes an StudioCMS config file ("studiocms.config.mjs")
				that could not be loaded due to ${code ? `the error ${code}` : 'the following error'}: ${message}`.replace(/\s+/g, ' '),
				error instanceof Error ? { cause: error } : undefined
			)
		}
	}
	return {}
}