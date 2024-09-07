---
editUrl: false
next: true
prev: true
title: RobotsConfig
slug: 0.1.0-beta.5/typedoc/studiocms-robotstxt/index/interfaces/robotsconfig
---

## Properties

### host?

> `optional` **host**: `string` | `boolean`

#### Default

```ts
false
```

#### Description

\[ Optional ] Some crawlers(Yandex) support and only accept domain names.

#### Example

```ts
integrations:[
 robots({
   host: siteUrl.replace(/^https?://|:\d+/g, "")
 })
]
```

#### Defined in

[index.ts:32](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_robotstxt/src/index.ts#L32)

***

### policy?

> `optional` **policy**: [`PolicyOptions`](/0.1.0-beta.5/typedoc/studiocms-robotstxt/index/interfaces/policyoptions/)\[]

#### Description

\[ Optional ] List of `policy` rules.

#### Default

```ts
policy:[
 {
   userAgent: "*",
   allow: "/"
 }
]
```

For more help, refer to [SYNTAX](https://yandex.com/support/webmaster/controlling-robot/robots-txt.html#recommend) by Yandex.

#### Defined in

[index.ts:60](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_robotstxt/src/index.ts#L60)

***

### sitemap?

> `optional` **sitemap**: `string` | `boolean` | `string`\[]

#### Description

\[ Optional, zero or more per file ] The location of a sitemap for this website.

#### Example

```ts
sitemap: [
 "https://example.com/sitemap.xml",
 "https://www.example.com/sitemap.xml"
]
```

The value of the [SITEMAP](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt#sitemap) field is case-sensitive.

#### Defined in

[index.ts:45](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_robotstxt/src/index.ts#L45)
