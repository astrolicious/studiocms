import { defineStudioCMSConfig, defineStudioCMSPlugin } from '@studiocms/core/lib';
import type { StudioCMSPluginOptions } from '@studiocms/core/types';
import integration from './integration';

export const studioCMS = integration;

export default studioCMS;

// Config Utility
export { defineStudioCMSConfig };

// Plugin System
export { defineStudioCMSPlugin, type StudioCMSPluginOptions };
