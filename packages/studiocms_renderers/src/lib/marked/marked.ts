import Config from 'virtual:studiocms/config';
import {
	transformerMetaHighlight,
	transformerMetaWordHighlight,
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationFocus,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { type MarkedExtension, marked } from 'marked';
import markedAlert from 'marked-alert';
import { markedEmoji } from 'marked-emoji';
import markedFootnote from 'marked-footnote';
import markedShiki from 'marked-shiki';
import { markedSmartypants } from 'marked-smartypants';
import { createHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';
import emojiList from './emoji-en-US.json';

const {
	markedConfig: {
		loadmarkedExtensions,
		highlighterConfig: {
			highlighter: selectedHighlighter,
			shikiConfig: { theme: shikiTheme, loadThemes: shikiLoadThemes, loadLangs: shikiLoadLangs },
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

export async function renderMarked(input: string): Promise<string> {
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
		// Create Shiki Highlighter

		// Load Shiki Themes
		const shikiThemeConfig = [];

		// Set the Default Bundle Themes
		const studioCMSDefaultThemes = [
			import('shiki/themes/houston.mjs'),
			import('shiki/themes/github-dark.mjs'),
			import('shiki/themes/github-light.mjs'),
			import('shiki/themes/night-owl.mjs'),
		];

		// Add the Default Themes to the Config
		shikiThemeConfig.push(...studioCMSDefaultThemes);

		// Add any additional UserLoaded Themes to the Config
		if (shikiLoadThemes) {
			shikiThemeConfig.push(...shikiLoadThemes);
		}

		// Load Shiki Languages
		const shikiLangsConfig = [];

		// Set the Default Bundle Languages
		const studioCMSDefaultLangs = [
			import('shiki/langs/astro.mjs'),
			import('shiki/langs/typescript.mjs'),
			import('shiki/langs/javascript.mjs'),
			import('shiki/langs/json.mjs'),
			import('shiki/langs/css.mjs'),
			import('shiki/langs/html.mjs'),
			import('shiki/langs/markdown.mjs'),
			import('shiki/langs/mdx.mjs'),
			import('shiki/langs/yaml.mjs'),
			import('shiki/langs/rust.mjs'),
			import('shiki/langs/python.mjs'),
			import('shiki/langs/go.mjs'),
		];

		// Add the Default Languages to the Config
		shikiLangsConfig.push(...studioCMSDefaultLangs);

		// Add any additional UserLoaded Languages to the Config
		if (shikiLoadLangs) {
			shikiLangsConfig.push(...shikiLoadLangs);
		}

		// Create Shiki Highlighter
		const shikiHighlighter = await createHighlighterCore({
			themes: shikiThemeConfig,
			langs: shikiLangsConfig,
			loadWasm: getWasm,
		});

		// Add Shiki to the Custom Marked Extensions
		customMarkedExtList.push(
			markedShiki({
				highlight(code, lang, props) {
					return shikiHighlighter.codeToHtml(code, {
						lang,
						theme: shikiTheme,
						meta: { __raw: props.join(' ') }, // required by `transformerMeta*`
						transformers: [
							transformerNotationDiff(),
							transformerNotationHighlight(),
							transformerNotationWordHighlight(),
							transformerNotationFocus(),
							transformerNotationErrorLevel(),
							transformerMetaHighlight(),
							transformerMetaWordHighlight(),
						],
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
