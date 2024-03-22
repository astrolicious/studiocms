import type { AstroConfig } from "astro";
import { describe, expect, test } from "vitest";
import { hasVitePlugin } from "../../src/utilities/has-vite-plugin.js";

describe("hasVitePlugin", () => {
	const name = "vite-plugin-my-integration";
	const plugin = { name };

	test("Should not detect a plugin", () => {
		const config = {} as AstroConfig;

		expect(
			hasVitePlugin({
				plugin: null,
				config,
			}),
		).toBe(false);
	});

	test("Should detect a plugin using a string", () => {
		const config = {
			vite: {
				plugins: [plugin],
			},
		} as AstroConfig;

		expect(
			hasVitePlugin({
				plugin: name,
				config,
			}),
		).toBe(true);
	});

	test("Should detect a plugin using a plugin", () => {
		const config = {
			vite: {
				plugins: [plugin],
			},
		} as AstroConfig;

		expect(
			hasVitePlugin({
				plugin,
				config,
			}),
		).toBe(true);
	});

	test("Should detect a plugin using a nested plugin", () => {
		const config = {
			vite: {
				plugins: [plugin],
			},
		} as AstroConfig;

		expect(
			hasVitePlugin({
				plugin: [[[plugin]]],
				config,
			}),
		).toBe(true);
	});

	test("Should detect a nested plugin", () => {
		const config = {
			vite: {
				plugins: [[[plugin]]],
			},
		} as AstroConfig;

		expect(
			hasVitePlugin({
				plugin,
				config,
			}),
		).toBe(true);
	});
});
