import {
	type StudioCMSRendererConfig,
	StudioCMSRendererConfigSchema,
} from '@studiocms/core/schemas';
import integration from './integration';

/**
 * StudioCMS Renderers Integration
 */
const studioCMSRenderers = integration;

export default studioCMSRenderers;

export { StudioCMSRendererConfigSchema, type StudioCMSRendererConfig };
