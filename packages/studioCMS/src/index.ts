import type { StudioCMSOptions } from './schemas';
import studioCMS from './studioCMS';

export const studioCMSPluginList = new Map<string, { name: string, label: string }>();

export function defineStudioCMSConfig(config: StudioCMSOptions) {
    return config;
}

export default studioCMS;
