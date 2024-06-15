import type { AstroIntegration } from "astro";
import { addIntegration, defineUtility } from "astro-integration-kit";
import { studioLogger, type StudioLoggerOptsResolverResponse } from ".";

export const addIntegrationArray = defineUtility("astro:config:setup")(
    ( 
        params, 
        opts: {
            integrations: AstroIntegration[],
            LoggerOpts: StudioLoggerOptsResolverResponse,
        },
     ) => {
            for (const integration of opts.integrations) {
                studioLogger(opts.LoggerOpts.logInfo, `Injecting Integration: ${integration.name}`);
                addIntegration(params, { integration });
            }
    }
)