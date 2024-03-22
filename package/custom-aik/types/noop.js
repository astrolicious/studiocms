/**
 * Type-only import is not supported with the nice syntax for modules across packages.
 * This requires libraries using the extended types provided by AIK with one of the syntaxes below:
 * - `import type {} from 'astro-integration-kit/types/db';` with the empty `{}`
 * - `/// <reference types="astro-integration-kit/types/db" />` with the triple-slash directive`
 *
 * None of those are as nice as simply `import 'astro-integration-kit/types/db';`.
 *
 * Using the plain import means it will attempt to import a JS file during module resolution,
 * which would fail at runtime because the type extensions are only available as types.
 *
 * As a workaround for that, this file exists. The type extensions are declared in the package.json
 * with this file as their runtime counterpart, so the import will succeed and not throw at runtime.
 *
 * This file is a no-op, it does nothing. It is just a placeholder to make the nice import work.
 *
 * @see https://discord.com/channels/830184174198718474/1197638002764152843/1220528418035208212
 */
