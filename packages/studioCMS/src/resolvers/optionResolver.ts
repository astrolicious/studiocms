import type { AstroConfig, AstroIntegrationLogger } from "astro";
import { loadStudioCMSConfigFile } from "../studiocms-config";
import { optionsSchema, type StudioCMSOptions } from "../schemas";
import { studioErrors } from "../strings";
import { integrationLogger } from "../utils";
import { AstroError } from "astro/errors";

export const optionResolver = async (astroConfig: AstroConfig, options: StudioCMSOptions, logger: AstroIntegrationLogger) => {

    // Merge the given options with the ones from a potential StudioCMS config file
    const studioCMSConfigFile = await loadStudioCMSConfigFile(astroConfig.root);
    let mergedOptions: StudioCMSOptions = { ...options };
    if (studioCMSConfigFile && Object.keys(studioCMSConfigFile).length > 0) {
        const parsedOptions = optionsSchema.safeParse(studioCMSConfigFile);

        // If the StudioCMS config file is invalid, throw an error
        if (!parsedOptions.success || parsedOptions.error || !parsedOptions.data) {
            const parsedErrors = parsedOptions.error.errors;
            const parsedErrorMap = parsedErrors.map((e) => ` - ${e.message}`).join('\n');
            const parsedErrorString = `${studioErrors.failedToParseConfig}\n${parsedErrorMap}`;

            integrationLogger(logger, true, 'error', parsedErrorString);
            throw new AstroError(studioErrors.invalidConfigFile, parsedErrorString);
        }

        mergedOptions = { ...optionsSchema._def.defaultValue, ...parsedOptions.data }
    }

    return mergedOptions;
}