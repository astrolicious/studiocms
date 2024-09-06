---
"@studiocms/renderers": patch
---

[MarkDoc] Update MarkDoc support

- Add advanced config options for MarkDoc

```ts
studioCMS({
    rendererConfig: {
        markdocConfig: {
            /**
             * The MarkDoc Content Renderer to use for rendering pages and posts
             *
             * Can be one of the following: `html`, `react`, `react-static`
             */
            renderType: 'html',
            /**
             * The MarkDoc Arg Parse to use for rendering pages and posts
             */
            argsParse: {
                file: 'string',
                slots: false,
                location: false,
            },
            /**
             * The MarkDoc Transform Config to use for rendering pages and posts
             *
             * @see https://markdoc.dev/docs/config
             */
            transformConfig: {
                nodes: {},
                tags: {},
                variables: {},
                functions: {},
                partials: {},
                validation: {};
            },
            /**
             * The MarkDoc React Components to use for rendering pages and posts
             */
            reactComponents: {},
        }
    }
})
```

- Add support for MarkDoc `renderType` of `html`, and `react-static`