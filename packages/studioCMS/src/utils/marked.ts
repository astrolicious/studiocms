import Config from 'virtual:astro-studio-cms:config';
import { type MarkedExtension, marked } from 'marked';
import markedAlert from 'marked-alert';
import { markedEmoji } from 'marked-emoji';
import markedFootnote from 'marked-footnote';
import { markedSmartypants } from 'marked-smartypants';
import emojiList from './emoji-en-US.json';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

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
		const { createShikiHighlighter } = await import('@astrojs/markdown-remark');
		const markedShiki = (await import('marked-shiki')).default;

		const highlighter = await createShikiHighlighter({ theme: shikiTheme });
		customMarkedExtList.push(
			markedShiki({
				highlight(code, lang, props) {
					return highlighter.highlight(code, lang, {
						attributes: {
							class: props.join(' '),
						},
					});
				},
			})
		);
	} else if (selectedHighlighter === 'highlightJs') {

		// customMarkedExtList.push(
		// 	markedHighlight({
		// 		langPrefix: 'hljs language-',
		// 		highlight(code, lang) {
		// 			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
		// 			return hljs.highlightAuto(code).value;
		// 		},
		// 	})
		// );
	}

	// Load any additional User-Defined marked extensions
	if (loadmarkedExtensions) {
		customMarkedExtList.push(...loadmarkedExtensions);
	}

	marked.use(...customMarkedExtList, { async: true, gfm: true });

	const content = await marked.parse(input);

	return content;
}
