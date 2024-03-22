import * as astro from 'astro';
import { DevToolbarApp } from 'astro';
import { Prettify, UnionToArray, UnionToIntersection } from '../internal/types.js';

type Plugin<TName extends string, THook extends keyof Hooks, TImplementation extends (...args: Array<any>) => any> = {
    name: TName;
    hook: THook;
    implementation: (params: HookParameters<THook>, integrationOptions: {
        name: string;
    }) => TImplementation;
};
type AnyPlugin = Omit<Plugin<string, keyof Hooks, any>, "implementation"> & {
    implementation: any;
};
declare global {
    namespace AstroIntegrationKit {
        interface ExtraHooks {
        }
    }
}
type Hooks = Prettify<Required<NonNullable<astro.AstroIntegration["hooks"]>> & AstroIntegrationKit.ExtraHooks>;
type HookParameters<T extends keyof Hooks> = Parameters<Hooks[T]>[0];
type FilterPluginsByHook<TPlugins extends Array<AnyPlugin>, THook extends keyof Hooks> = Extract<TPlugins[number], {
    hook: THook;
}>;
type OverridePlugins<T extends Array<AnyPlugin>, U = {}> = T extends [] ? UnionToIntersection<U> : T extends [infer Head, ...infer Tail] ? Head extends AnyPlugin ? Tail extends Array<AnyPlugin> ? Head["name"] extends keyof U ? OverridePlugins<Tail, Omit<U, Head["name"]> & {
    [K in Head["name"]]: Head;
}> : OverridePlugins<Tail, U & {
    [K in Head["name"]]: Head;
}> : never : never : never;
type AssertPluginsArray<T extends Array<unknown>> = T extends Array<AnyPlugin> ? T : never;
type PluginsToImplementation<TPlugins extends Record<string, AnyPlugin>> = {
    [K in keyof TPlugins]: TPlugins[K] extends Plugin<infer _Name, infer _Hook, infer Implementation> ? Implementation : never;
};
/**
 * @internal
 */
type AddedParam<TPlugins extends Array<AnyPlugin>, THook extends keyof Hooks> = Prettify<PluginsToImplementation<OverridePlugins<AssertPluginsArray<UnionToArray<FilterPluginsByHook<TPlugins, THook>>>>>>;
type AddParam<Func, Param = never> = [Param] extends [never] ? Func : Func extends (params: infer Params) => infer ReturnType ? (params: Params & Param) => ReturnType : never;
type ExtendedHooks<TPlugins extends Array<AnyPlugin>> = {
    [Hook in keyof Hooks]?: Hooks[Hook] extends Function ? AddParam<Hooks[Hook], AddedParam<TPlugins, Hook>> : never;
};
interface DevToolbarFrameworkAppProps {
    canvas: Parameters<Required<DevToolbarApp>["init"]>[0];
    eventTarget: Parameters<Required<DevToolbarApp>["init"]>[1];
    renderWindow: HTMLElementTagNameMap["astro-dev-toolbar-window"];
}

export type { AddedParam, AnyPlugin, DevToolbarFrameworkAppProps, ExtendedHooks, HookParameters, Hooks, Plugin };
