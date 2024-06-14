import type { AstroIntegration } from "astro";
import { addIntegration, defineUtility, hasIntegration } from "astro-integration-kit";
import { studioLogger, type StudioLoggerOptsResolverResponse } from ".";

export const addExternalIntegration = defineUtility("astro:config:setup")(
    ( 
        params, 
        opts: { 
            knownSimilar: string[], 
            integration: AstroIntegration,
            LoggerOpts: StudioLoggerOptsResolverResponse,
        } ) => {

        for (const known of opts.knownSimilar) {
            if (hasIntegration(params, { name: known })) {
                studioLogger(opts.LoggerOpts.logInfo, `Integration ${known} already exists. Skipping ${opts.integration.name}...`)
            }
        }

        studioLogger(opts.LoggerOpts.logInfo, `No known similar integrations found. Adding ${opts.integration.name}...`)

        addIntegration(params, { integration: opts.integration });
    }
)