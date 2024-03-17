import type { AstroIntegrationLogger } from "astro";

export const getAstroBaseURL = () => {
    return import.meta.env.BASE_URL
};

export const integrationLogger = async (
    logger: AstroIntegrationLogger, 
    isVerbose: boolean,
    type: "info"|"warn"|"error", 
    message: string,
    ) => {
        // if checkVerbose is true and isVerbose is true, log the message
        if (isVerbose) {
            if (type === "info") {
                logger.info(message);
            } else if (type === "warn") {
                logger.warn(message);
            } else if (type === "error") {
                logger.error(message);
            } 
        }
    };