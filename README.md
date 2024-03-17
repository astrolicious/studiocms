# Astro Studio CMS

This is a SSR Blog CMS built with AstroDB / Lucia Auth / Unpic Image handler / Astro

To see how to get started, check out the [package README](./package/README.md)

## Notes

- DB Injection waits till after the first page loads before local DB is created... if your having problems try pinging `localhost:4321/gen` with the config option `disableAuth: true` to resolve

## Licensing

[MIT Licensed](./LICENSE). Made with ❤️ by [Adam M.](https://github.com/adammatthiesen).
