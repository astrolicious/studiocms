import { marked, type MarkedExtension } from "marked";
import markedAlert from "marked-alert";
import markedFootnote from "marked-footnote";
import { markedSmartypants } from "marked-smartypants";
import { markedEmoji } from "marked-emoji";
import Config from 'virtual:astro-studio-cms:config';
import emojiList from "./emoji-en-US.json"

const { 
    markedConfig: { 
        loadmarkedExtensions,
        includedExtensions: {
            markedAlert: mAlertExt, 
            markedEmoji: mEmojiExt, 
            markedFootnote: mFootnoteExt, 
            markedSmartypants: mSmartypantsExt
        }, } 
} = Config;


export const emojiMap = Object.entries(emojiList).reduce(
    (ret, [emoji, names]) => {
        for (const name of names) {
            ret[name] = ret[name] || emoji;
        }
        return ret;
    },
    {} as Record<string, string>
);


export async function markdown(input: string): Promise<string> {
    const markedExtensions: MarkedExtension[] = [];

    if ( mAlertExt ) {
        markedExtensions.push(markedAlert());
    }
    if ( mEmojiExt ) {
        markedExtensions.push(markedEmoji({ emojis: emojiMap, unicode: true }));
    }
    if ( mFootnoteExt ) {
        markedExtensions.push(markedFootnote());
    }
    if ( mSmartypantsExt ) {
        markedExtensions.push(markedSmartypants());
    }

    if ( loadmarkedExtensions ) {
        markedExtensions.push(...loadmarkedExtensions);
    }

    marked.use( ...markedExtensions, { async: true, gfm: true } );

    const content = await marked.parse(input);

    return content;
}