import { defineConfig } from "tsup";
import { peerDependencies } from "./package.json";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: ["src/**/*.(ts|js)", "!src/internal/internal.d.ts"],
		format: ["esm"],
		target: "node18",
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [...Object.keys(peerDependencies), "@@COMPONENT_SRC@@"],
		tsconfig: "tsconfig.build.json",
	};
});
