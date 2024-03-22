import type {
	AstroConfig,
	AstroIntegrationLogger,
	HookParameters,
} from "astro";
import type { Plugin } from "vite";
import { describe, expect, test, vi } from "vitest";
import { addVitePlugin } from "../../src/utilities/add-vite-plugin.js";

describe("addVitePlugin", () => {
	test("Should run", () => {
		const updateConfig = vi.fn();

		expect(() =>
			addVitePlugin({
				warnDuplicated: false,
				plugin: null,
				updateConfig,
			}),
		).not.toThrow();
	});

	test("Should call updateConfig", () => {
		const updateConfig = vi.fn();

		addVitePlugin({
			warnDuplicated: false,
			plugin: null,
			updateConfig,
		});

		expect(updateConfig).toHaveBeenCalled();
	});

	test("Should add vite plugin", () => {
		let plugin: Plugin;
		const pluginName = "test-plugin";

		const updateConfig = vi.fn((config) => {
			plugin = config.vite.plugins[0];
		}) as unknown as HookParameters<"astro:config:setup">["updateConfig"];

		const expectedPlugin = {
			name: pluginName,
		};

		addVitePlugin({
			warnDuplicated: false,
			plugin: expectedPlugin,
			updateConfig,
		});

		// @ts-ignore
		expect(plugin).toBeDefined();
	});

	test("Plugin name should match", () => {
		let plugin: Plugin;
		const pluginName = "test-plugin";

		const updateConfig = vi.fn((config) => {
			plugin = config.vite.plugins[0];
		}) as unknown as HookParameters<"astro:config:setup">["updateConfig"];

		const expectedPlugin = {
			name: pluginName,
		};

		addVitePlugin({
			warnDuplicated: false,
			plugin: expectedPlugin,
			updateConfig,
		});

		// @ts-ignore
		expect(plugin.name).toBe(pluginName);
	});

	test("Should log warning if plugin name already exists", () => {
		const plugin = {
			name: "test-plugin",
		};
		const config = {
			vite: {
				plugins: [plugin],
			},
		} as AstroConfig;

		const logger = {
			warn: vi.fn(),
		} as unknown as AstroIntegrationLogger;

		const updateConfig = vi.fn();

		addVitePlugin({
			plugin,
			config,
			logger,
			updateConfig,
		});

		// @ts-ignore
		expect(logger.warn).toBeCalled();
	});
});
