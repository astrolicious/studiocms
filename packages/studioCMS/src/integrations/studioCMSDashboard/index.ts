import { defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";

export default defineIntegration({
    name: 'astrolicious/studioCMS:adminDashboard',
    optionsSchema: z.any(), // UPDATE ME
    setup({ options }) {
        return {
            hooks: {
                "astro:config:setup": ( params ) => {}
            }
        }
}});