import type { APIContext } from "astro";
import { db, eq, SiteConfig } from "astro:db";
import { CMSSiteConfigId } from "../../../../../constVars";
import Config from 'virtual:studiocms/config';
import { logger } from '@it-astro:logger:StudioCMS';
import { simpleResponse } from "../../../utils/simpleResponse";

const { dashboardConfig: { developerConfig: { testingAndDemoMode } } } = Config;

export async function POST(context: APIContext): Promise<Response> {

    // Check if testing and demo mode is enabled
    if (testingAndDemoMode) {
        logger.warn("Testing and demo mode is enabled, this action is disabled.");
        return simpleResponse(400, "Testing and demo mode is enabled, this action is disabled.");
    }

    // Get form data
    const formData = await context.request.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();

    // Check if title and description are Exists
    if (!title || !description) {
        logger.error("Invalid title or description");
        return simpleResponse(400, "Invalid title or description");
    }

    // Update Database
    try {
        await db.update(SiteConfig)
                .set({ title, description })
                .where(eq(SiteConfig.id, CMSSiteConfigId))
                .returning();
                
    } catch (error) {
        // Log error
        if (error instanceof Error) {
            logger.error(error.message);
        }
        // Return Error Response
        return simpleResponse(500, "Error updating site config");
    }

    // Return Response
    logger.info("Site config updated");
    return simpleResponse(200, "Site config updated");
}