import type { AstroIntegration } from "astro";
import { addIntegration, defineUtility, hasIntegration } from "astro-integration-kit";
import { studioLogger, type StudioLoggerOptsResolverResponse } from ".";

export const addIntegrationArrayWithCheck = defineUtility("astro:config:setup")(
    ( 
        params, 
        opts: { 
            LoggerOpts: StudioLoggerOptsResolverResponse,
            integrations: {
                enabled: boolean,
                knownSimilar: string[],
                integration: AstroIntegration,
            }[],
        }
    ) => { 
        // Run through each integration in the array
        for (const { enabled, knownSimilar, integration } of opts.integrations ) {
            // If the integration is enabled
            if ( enabled ) {
                // Check if the integration already exists
                for (const known of knownSimilar) {
                    if (hasIntegration(params, { name: known })) {
                        // If the integration exists, log that it is already there
                        studioLogger(opts.LoggerOpts.logInfo, `Integration ${known} already exists. Skipping ${integration.name}...`)
                        break;
                    }
                }
                // If the integration does not exist, add it
                studioLogger(opts.LoggerOpts.logInfo, `No known similar integrations found. Adding ${integration.name}...`)
                addIntegration(params, { integration, ensureUnique: true });
            } else {
                // If the integration is not enabled, log that it is disabled
                studioLogger(opts.LoggerOpts.logInfo, `Integration ${integration.name} is disabled. Skipping...`)
            }

        }

    }
)