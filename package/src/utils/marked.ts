import { marked, type MarkedExtension } from "marked";
import markedAlert from "marked-alert";
import markedFootnote from "marked-footnote";
import { markedSmartypants } from "marked-smartypants";
import markedShiki from 'marked-shiki'
import { bundledLanguages, 
    // bundledThemes, 
    getHighlighter} from 'shiki'
import * as sT from '@shikijs/transformers'
import { markedEmoji } from "marked-emoji";
import Config from 'virtual:astro-studio-cms:config';
import emojiList from "./emoji-en-US.json"

const { markedConfig: { loadmarkedExtensions,
        shikiConfig: { theme: shikiTheme },
        includedExtensions: {
            markedAlert: mAlertExt, 
            markedEmoji: mEmojiExt, 
            markedFootnote: mFootnoteExt, 
            markedSmartypants: mSmartypantsExt
}, } } = Config;


export const emojiMap = Object.entries(emojiList).reduce((ret, [emoji, names]) => {
        for (const name of names) { ret[name] = ret[name] || emoji; }
        return ret; }, {} as Record<string, string>
);


export async function markdown(input: string): Promise<string> {
    const customMarkedExtList: MarkedExtension[] = [];

    if ( mAlertExt ) {
        customMarkedExtList.push(markedAlert());
    }
    if ( mEmojiExt ) {
        customMarkedExtList.push(markedEmoji({ emojis: emojiMap, unicode: true }));
    }
    if ( mFootnoteExt ) {
        customMarkedExtList.push(markedFootnote());
    }
    if ( mSmartypantsExt ) {
        customMarkedExtList.push(markedSmartypants());
    }

    if ( loadmarkedExtensions ) {
        customMarkedExtList.push(...loadmarkedExtensions);
    }

    const langs: string[] = [];
    const themes: string[] = [];

    for (const lang of Object.keys(bundledLanguages)) {
        langs.push(lang);
    }
    // for (const theme of Object.keys(bundledThemes)) {
    //     themes.push(theme);
    // }

    const highlighter = await getHighlighter({ langs, themes });

    customMarkedExtList.push(markedShiki({
        highlight(code, lang, props) {
            return highlighter.codeToHtml(code, { 
                        lang, theme: shikiTheme,
                        meta: {__raw: props.join(' ')},
                        transformers: [
                            sT.transformerNotationDiff(),
                            sT.transformerNotationHighlight(),
                            sT.transformerNotationWordHighlight(),
                            sT.transformerNotationFocus(),
                            sT.transformerNotationErrorLevel(),
                            sT.transformerMetaHighlight(),
                            sT.transformerMetaWordHighlight(),
                        ]
                    }) },}),)

    marked.use( ...customMarkedExtList, { async: true, gfm: true } );

    const content = await marked.parse(input);

    return content;
}