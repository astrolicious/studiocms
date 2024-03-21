import type { AstroIntegrationLogger } from "astro";
import { Marked } from "marked";
import markedAlert from "marked-alert";
import markedFootnote from "marked-footnote";
import { markedSmartypants } from "marked-smartypants";
import { markedEmoji } from "marked-emoji";
import emojiList from "emojilib/dist/emoji-en-US.json";

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
    

export const emojiMap = Object.entries(emojiList).reduce(
    (ret, [emoji, names]) => {
        for (const name of names) {
            ret[name] = ret[name] || emoji;
        }
        return ret;
    },
    {} as Record<string, string>
);

export const customMarked = new Marked( 
    markedAlert(), 
    markedSmartypants(),
    markedFootnote(),
    markedEmoji({ emojis: emojiMap, unicode: true }),
    { async: true, gfm: true, }, 
);