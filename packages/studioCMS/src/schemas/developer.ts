import { z } from "astro/zod";

export const developerConfigSchema = z.object({
    /**
     * Allows the user to enable Astro's View Transition API for the Astro Studio CMS Dashboard
     * 
     * Disabled do to the fact that the View Transition API is still in development and is not ready for production use.
     * 
     * **NOT YET IMPLEMENTED** - There is a bug with the View Transition API that causes this feature to not work as expected.
     */
    viewTransitionAPI: z.boolean().optional().default(false),
    /**
     * Enable Testing and Demo Mode
     * 
     * This will enable the testing and demo mode for the Astro Studio CMS Dashboard, this will allow you to test the dashboard without having to authenticate. This is useful for testing and demo purposes as it will allow you to see how the dashboard works and looks but disable any changes to the database.
     * 
     * @default false
     */
    testingAndDemoMode: z.boolean().optional().default(false),
}).optional().default({});