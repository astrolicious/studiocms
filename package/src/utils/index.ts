import type { AstroIntegrationLogger } from "astro";

export const getAstroBaseURL = () => {
    // @ts-ignore - This works fine during runtime and can be safely ignored
    return import.meta.env.BASE_URL
};

export const integrationLogger = async (
    logger: AstroIntegrationLogger, 
    verbose: boolean,
    type: "info"|"warn"|"error", 
    message: string,
    ) => {
        // if checkVerbose is true and isVerbose is true, log the message
        if (verbose) {
            if (type === "info") {
                logger.info(message);
            } else if (type === "warn") {
                logger.warn(message);
            } else if (type === "error") {
                logger.error(message);
            } 
        }
    };
    
