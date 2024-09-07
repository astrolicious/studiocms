---
editUrl: false
next: true
prev: true
title: PolicyOptions
slug: 0.1.0-beta.5/typedoc/studiocms-robotstxt/index/interfaces/policyoptions
---

## Properties

### allow?

> `optional` **allow**: `string` | `string`\[]

#### Description

\[ At least one or more `allow` or `disallow` entries per rule ] Allows indexing site sections or individual pages.

#### Example

```ts
policy:[{allow:["/"]}]
```

Path-based URL matching, refer to [SYNTAX](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt#url-matching-based-on-path-values) via Google.

#### Defined in

[index.ts:92](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_robotstxt/src/index.ts#L92)

***

### cleanParam?

> `optional` **cleanParam**: `string` | `string`\[]

#### Description

\[ Optional ] Indicates to the robot that the page URL contains parameters (like UTM tags) that should be ignored when indexing it.

#### Example

```hash
# for URLs like:
www.example2.com/index.php?page=1&sid=2564126ebdec301c607e5df
www.example2.com/index.php?page=1&sid=974017dcd170d6c4a5d76ae
```

```ts
policy:[
 {
   cleanParam: [
     "sid /index.php",
   ]
 }
]
```

For additional examples, please consult
Yandex's [SYNTAX](https://yandex.com/support/webmaster/robot-workings/clean-param.html#clean-param__additional) guide.

#### Defined in

[index.ts:143](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_robotstxt/src/index.ts#L143)

***

### crawlDelay?

> `optional` **crawlDelay**: `number`

#### Description

\[ Optional ] Specifies the minimum interval (in seconds) for the search robot to wait after loading one page, before starting to load another.

#### Example

```ts
policy:[{crawlDelay:5}]
```

About the [Crawl-delay](https://yandex.com/support/webmaster/robot-workings/crawl-delay.html#crawl-delay) directive.

#### Defined in

[index.ts:120](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_robotstxt/src/index.ts#L120)

***

### disallow?

> `optional` **disallow**: `string` | `string`\[]

#### Description

\[ At least one or more `disallow` or `allow` entries per rule ] Prohibits indexing site sections or individual pages.

#### Example

```ts
policy:[
 {
   disallow:[
     "/admin",
     "/uploads/1989-08-21/*.jpg$"
   ]
 }
]
```

Path-based URL matching, refer to [SYNTAX](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt#url-matching-based-on-path-values) via Google.

#### Defined in

[index.ts:109](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_robotstxt/src/index.ts#L109)

***

### userAgent?

> `optional` **userAgent**: [`UsertAgentType`](/0.1.0-beta.5/typedoc/studiocms-robotstxt/consts/type-aliases/usertagenttype/) | [`UsertAgentType`](/0.1.0-beta.5/typedoc/studiocms-robotstxt/consts/type-aliases/usertagenttype/)\[]

#### Description

\[ Required ] Indicates the robot to which the rules listed in `robots.txt` apply.

#### Example

```ts
policy:[
 {
   userAgent: [
     'Googlebot',
     'Applebot',
     'Baiduspider',
     'bingbot'
   ],
   // crawling rule(s) for above bots
 }
]
```

Verified bots, refer to [DITIG](https://www.ditig.com/robots-txt-template#regular-template) or [Cloudflare Radar](https://radar.cloudflare.com/traffic/verified-bots).

#### Defined in

[index.ts:82](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_robotstxt/src/index.ts#L82)
