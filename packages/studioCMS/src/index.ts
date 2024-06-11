import type { StudioCMSOptions } from './schemas';
import studioCMS from './studioCMS';

export const studioCMSPluginList = new Map<string, { name: string, label: string }>();
export const externalNavigation = new Map<string, { text: string, slug: string }>();
export const customRendererPlugin = new Set<string>();

export function defineStudioCMSConfig(config: StudioCMSOptions) {
    return config;
}

export { studioCMS };

export default studioCMS;
