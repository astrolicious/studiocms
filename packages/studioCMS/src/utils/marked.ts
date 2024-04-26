import Config from 'virtual:astro-studio-cms:config';
import { type MarkedExtension, marked } from 'marked';
import markedAlert from 'marked-alert';
import { markedEmoji } from 'marked-emoji';
import markedFootnote from 'marked-footnote';
import markedShiki from 'marked-shiki';
import { markedSmartypants } from 'marked-smartypants';
import emojiList from './emoji-en-US.json';
import { bundledLanguages, getHighlighter } from 'shiki/bundle/web'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
  transformerMetaWordHighlight
} from '@shikijs/transformers'

const {
	markedConfig: {
		loadmarkedExtensions,
		highlighterConfig: {
			highlighter: selectedHighlighter,
			shikiConfig: { theme: shikiTheme },
		},
		includedExtensions: {
			markedAlert: mAlertExt,
			markedEmoji: mEmojiExt,
			markedFootnote: mFootnoteExt,
			markedSmartypants: mSmartypantsExt,
		},
	},
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
	const customMarkedExtList: MarkedExtension[] = [];

	// MarkedAlert Extension
	if (mAlertExt) {
		customMarkedExtList.push(markedAlert());
	}

	// MarkedEmoji Extension
	if (mEmojiExt) {
		customMarkedExtList.push(markedEmoji({ emojis: emojiMap, unicode: true }));
	}

	// MarkedFootnote Extension
	if (mFootnoteExt) {
		customMarkedExtList.push(markedFootnote());
	}

	// MarkedSmartypants Extension
	if (mSmartypantsExt) {
		customMarkedExtList.push(markedSmartypants());
	}

	// Setup Marked Highlighter
	if (selectedHighlighter === 'shiki') {
	  
		const highlighter = await getHighlighter({ 
			themes: [shikiTheme],
			langs: Object.keys(bundledLanguages)
		});

		customMarkedExtList.push(
			markedShiki({
				highlight(code, lang, props) {
					return highlighter.codeToHtml(code, { 
						lang, 
						theme: shikiTheme, 
						meta: { __raw: props.join(' ') },// required by `transformerMeta*`
						transformers: [
							transformerNotationDiff(),
							transformerNotationHighlight(),
							transformerNotationWordHighlight(),
							transformerNotationFocus(),
							transformerNotationErrorLevel(),
							transformerMetaHighlight(),
							transformerMetaWordHighlight()
						] 
					});
				},
			})
		);
	}

	// Load any additional User-Defined marked extensions
	if (loadmarkedExtensions) {
		customMarkedExtList.push(...loadmarkedExtensions);
	}

	marked.use(...customMarkedExtList, { async: true, gfm: true });

	const content = await marked.parse(input);

	return content;
}
