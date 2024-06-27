import { addDts, addVirtualImports, createResolver, defineUtility, hasIntegration } from "astro-integration-kit";
import { studioLogger, type StudioLoggerOptsResolverResponse } from "../../../utils";
import { webVitalStrings } from "../strings";
import { fileFactory } from "../../../utils/fileFactory";

const { resolve } = createResolver(import.meta.url);

export const checkForWebVitals = defineUtility('astro:config:setup')(
    ( 
            params, 
            opts: {
                name: string,
                LoggerOpts: StudioLoggerOptsResolverResponse,
            } 
        ) => {

            studioLogger(opts.LoggerOpts.logInfo, webVitalStrings.checkForWebVitals);

            // Check for Web Vitals
            if ( hasIntegration(params, { name: "@astrojs/web-vitals" })) {

                // Log that the Web Vitals Integration is Present
                studioLogger(opts.LoggerOpts.logInfo, webVitalStrings.webVitalsFound);

            } else {
                // Log that the Web Vitals Integration is Missing
                studioLogger(opts.LoggerOpts.logWarn, webVitalStrings.webVitalsMissing);
            }

            // Add the Web Vitals StudioCMS interface
            addVirtualImports(params,{
                name: opts.name, 
                imports: { 
                    'studiocms-dashboard:web-vitals' : `export * from "${resolve("./webVital.ts")}"` 
                }
            });

            // Create the Web Vitals DTS File
            const webVitalDTS = fileFactory();
            webVitalDTS.addLines(`declare module 'studiocms-dashboard:web-vitals' {
                /** Type Definitions for getWebVitals helper function */
                export type WebVitalsResponseItem = import('${resolve("./webVital.ts")}').WebVitalsResponseItem;

                /** Get Web Vitals Helper function */
                export const getWebVitals: typeof import('${resolve("./webVital.ts")}').getWebVitals;
            };`);

            // Add the Web Vitals DTS File
            addDts(params, { name: "@astrolicious/studiocms:web-vitals", content: webVitalDTS.text() });
    }
)