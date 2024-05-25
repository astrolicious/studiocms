import type { StudioCMSOptions } from './schemas';
import studioCMS from './studioCMS';

export default studioCMS;

export function defineStudioCMSConfig(config: StudioCMSOptions) {
    return config;
}