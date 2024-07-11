import type { AstroConfig } from "astro";
import { defineUtility } from "astro-integration-kit";


export const addAstroEnvConfig = defineUtility("astro:config:setup")(
    ( 
            params, 
            config: AstroConfig['experimental']['env']
        ) => {

        // Update Astro Config with Environment Variables (`astro:env`)
        params.updateConfig({ 
            experimental: { env: config } 
        });

        })