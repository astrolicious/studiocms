import { loadStudioCMSConfigFile } from "../studiocms-config";
import { optionsSchema, type StudioCMSOptions } from "../schemas";
import { studioErrors, warnings } from "../strings";
import { studioLogger, studioLoggerOptsResolver } from "../utils";
import { AstroError } from "astro/errors";
import { defineUtility } from "astro-integration-kit";

/**
 * Resolves the StudioCMS Options
 * 
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {StudioCMSOptions} options
 * 
 * @returns {StudioCMSOptions} The resolved StudioCMS Options
 */
export const oResolver = defineUtility("astro:config:setup")(
    async (params, options: StudioCMSOptions) => { 

        // Destructure Params
        const {
            logger,
            config: astroConfig,
        } = params;

        // Merge the given options with the ones from a potential StudioCMS config file
        const studioCMSConfigFile = await loadStudioCMSConfigFile(astroConfig.root);
        let resolvedOptions: StudioCMSOptions = { ...options };
        if (studioCMSConfigFile && Object.keys(studioCMSConfigFile).length > 0) {
            const parsedOptions = optionsSchema.safeParse(studioCMSConfigFile);

            // If the StudioCMS config file is invalid, throw an error
            if (!parsedOptions.success || parsedOptions.error || !parsedOptions.data) {
                const parsedErrors = parsedOptions.error.errors;
                const parsedErrorMap = parsedErrors.map((e) => ` - ${e.message}`).join('\n');
                const parsedErrorString = `${studioErrors.failedToParseConfig}\n${parsedErrorMap}`;
                throw new AstroError(studioErrors.invalidConfigFile, parsedErrorString);
            }

            // Merge the options with Defaults
            resolvedOptions = { ...optionsSchema._def.defaultValue, ...parsedOptions.data }

            // Log that the StudioCMS config file is being used if verbose
            const { logWarn } = await studioLoggerOptsResolver(logger, resolvedOptions.verbose);
            studioLogger(logWarn, warnings.StudioCMSConfigPresent);
        }

        return resolvedOptions;
})