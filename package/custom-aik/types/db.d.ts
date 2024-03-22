type AstroHookNames = keyof import("astro").AstroIntegration["hooks"];
type AstroDbHooks = Required<
	import("@astrojs/db/types").AstroDbIntegration["hooks"]
>;

type DbHooks = Omit<AstroDbHooks, AstroHookNames>;

declare namespace AstroIntegrationKit {
	export interface ExtraHooks extends DbHooks {}
}
