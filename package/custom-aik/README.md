# `astro-integration-kit`

This is a package that contains utilities to help you build Astro integrations.

## Documentation

Read the [Astro Integration Kit docs](https://astro-integration-kit.netlify.app).

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Watch for package changes:

```bash
pnpm package:dev
```

Start the playground:

```bash
pnpm playground:dev
```

Testing is using Vitest and all tests are co-located with the module they are testing.

To run all the tests:

```bash
pnpm test
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/florian-lefebvre/astro-integration-kit/blob/main/LICENSE). Made with ❤️ by [Florian Lefebvre](https://github.com/florian-lefebvre).
