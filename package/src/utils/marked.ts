import { marked, type MarkedExtension } from "marked";
import markedAlert from "marked-alert";
import markedFootnote from "marked-footnote";
import { markedSmartypants } from "marked-smartypants";
import { markedEmoji } from "marked-emoji";
import Config from 'virtual:astro-studio-cms:config';
import internalConfig from 'virtual:astro-studio-cms:internal';
import emojiList from "./emoji-en-US.json"

const { markedConfig: { loadmarkedExtensions,
        shikiConfig: { 
            enabled: enableShiki,
            theme: shikiTheme,
        },
        includedExtensions: {
            markedAlert: mAlertExt, 
            markedEmoji: mEmojiExt, 
            markedFootnote: mFootnoteExt, 
            markedSmartypants: mSmartypantsExt
}, } } = Config;

const { currentAdapter } = internalConfig;


export const emojiMap = Object.entries(emojiList).reduce((ret, [emoji, names]) => {
        for (const name of names) { ret[name] = ret[name] || emoji; }
        return ret; }, {} as Record<string, string>
);


export async function markdown(input: string): Promise<string> {
    const customMarkedExtList: MarkedExtension[] = [];

    // MarkedAlert Extension
    if ( mAlertExt ) {
        customMarkedExtList.push(markedAlert());
    }

    // MarkedEmoji Extension
    if ( mEmojiExt ) {
        customMarkedExtList.push(markedEmoji({ emojis: emojiMap, unicode: true }));
    }

    // MarkedFootnote Extension
    if ( mFootnoteExt ) {
        customMarkedExtList.push(markedFootnote());
    }

    // MarkedSmartypants Extension
    if ( mSmartypantsExt ) {
        customMarkedExtList.push(markedSmartypants());
    }

    // MarkedShiki Extension
    if ( enableShiki ) {
        // Check if the current adapter is Cloudflare
        if ( currentAdapter !== "@astrojs/cloudflare" ) {
            // if not, then use the shiki highlighter

            const { createShikiHighlighter } = await import('@astrojs/markdown-remark');
            const markedShiki = (await import('marked-shiki')).default;

            const highlighter = await createShikiHighlighter({ theme: shikiTheme })

            customMarkedExtList.push( markedShiki({ highlight(code, lang, props) {
                return highlighter.highlight(code, lang, {attributes: {class: props.join(' ')}})
            }, }));
        }
    }

    // Load any additional User-Defined marked extensions
    if ( loadmarkedExtensions ) {
        customMarkedExtList.push(...loadmarkedExtensions);
    }

    marked.use( ...customMarkedExtList, { async: true, gfm: true } );

    const content = await marked.parse(input);

    return content;
}