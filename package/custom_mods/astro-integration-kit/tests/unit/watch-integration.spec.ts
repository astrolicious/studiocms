import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, normalize } from "pathe";
import type { Plugin } from "vite";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createResolver } from "../../src/core/create-resolver.js";
import { watchIntegration } from "../../src/utilities/watch-integration.js";

const tempFolderName = ".TMP_WATCHINTEGRATION";

const tempPaths = [
	`${tempFolderName}/text.txt`,
	`${tempFolderName}/folderA/text.txt`,
	`${tempFolderName}/folderA/FolderB/text.txt`,
	`${tempFolderName}/folderA/FolderB/FolderC/text.txt`,
];

const { resolve } = createResolver(import.meta.url);

const createTempFiles = (paths: Array<string>) => {
	for (const path of paths) {
		const absolutePath = resolve(path);
		const directory = dirname(absolutePath);

		if (!existsSync(directory)) {
			mkdirSync(directory, {
				recursive: true,
			});
		}

		writeFileSync(absolutePath, "hello", {
			encoding: "utf-8",
		});
	}
};

const deleteTempFiles = () => {
	rmSync(resolve(tempFolderName), {
		recursive: true,
		force: true,
	});
};

describe("watchIntegration", () => {
	const command = "dev";

	beforeAll(() => {
		createTempFiles(tempPaths);
	});

	afterAll(() => {
		deleteTempFiles();
	});

	test("Should run", () => {
		const addWatchFile = vi.fn();
		const updateConfig = vi.fn();

		expect(() =>
			watchIntegration({
				dir: resolve(tempFolderName),
				addWatchFile,
				updateConfig,
				command,
			}),
		).not.toThrow();
	});

	test("Should call updateConfig", () => {
		const addWatchFile = vi.fn();
		const updateConfig = vi.fn();

		watchIntegration({
			dir: resolve(tempFolderName),
			addWatchFile,
			updateConfig,
			command,
		});

		expect(updateConfig).toBeCalled();
	});

	test("Should call updateConfig once", () => {
		const addWatchFile = vi.fn();
		const updateConfig = vi.fn();

		watchIntegration({
			dir: resolve(tempFolderName),
			addWatchFile,
			updateConfig,
			command,
		});

		expect(updateConfig).toBeCalledTimes(1);
	});

	test("Should call addWatchFile", () => {
		const addWatchFile = vi.fn();
		const updateConfig = vi.fn();

		watchIntegration({
			dir: resolve(tempFolderName),
			addWatchFile,
			updateConfig,
			command,
		});

		expect(addWatchFile).toBeCalled();
	});

	test("Should call addWatchFile for each path (count)", () => {
		const addWatchFile = vi.fn();
		const updateConfig = vi.fn();

		watchIntegration({
			dir: resolve(tempFolderName),
			addWatchFile,
			updateConfig,
			command,
		});

		const calls = addWatchFile.mock.calls.flatMap((entry) => entry[0]);

		expect(calls.length).toEqual(tempPaths.length);
	});

	test("Should call addWatchFile for each path (path check)", () => {
		const addWatchFile = vi.fn();
		const updateConfig = vi.fn();

		watchIntegration({
			dir: resolve(tempFolderName),
			addWatchFile,
			updateConfig,
			command,
		});

		const calls = addWatchFile.mock.calls.flatMap((entry) =>
			normalize(entry[0]),
		);

		const allPathsPresent = tempPaths.every((path) => {
			const resolvedPath = normalize(resolve(path));

			return calls.includes(resolvedPath);
		});

		expect(allPathsPresent).toBeTruthy();
	});

	test("Should create a vite plugin", () => {
		let plugin: Plugin;
		const addWatchFile = vi.fn();
		const updateConfig = vi.fn((config) => {
			plugin = config.vite.plugins[0];
		});

		watchIntegration({
			dir: resolve(tempFolderName),
			addWatchFile,
			updateConfig,
			command,
		});

		// @ts-ignore - TS can't figure out that plugin _will_ actually be defined here
		expect(plugin).toBeDefined();
	});

	test("Should create a vite plugin (check name)", () => {
		let plugin: Plugin;
		const addWatchFile = vi.fn();
		const updateConfig = vi.fn((config) => {
			plugin = config.vite.plugins[0];
		});

		watchIntegration({
			dir: resolve(tempFolderName),
			addWatchFile,
			updateConfig,
			command,
		});

		// @ts-ignore - TS can't figure out that plugin _will_ actually be defined here
		expect(plugin.name).toBeDefined();
	});
});
