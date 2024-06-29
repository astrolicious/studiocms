import type { WebVitalsResponseItem } from "studiocms-dashboard:web-vitals";
import { checkDate } from "./checkDate";

export const buildLcpDataObject = (webVitalData: WebVitalsResponseItem[]) => {
    const historicalData: WebVitalsResponseItem[] = [];
    const last24HoursData: WebVitalsResponseItem[] = [];
    const last7DaysData: WebVitalsResponseItem[] = [];
    const last30DaysData: WebVitalsResponseItem[] = [];

    if (webVitalData) {
        for (const item of webVitalData) {
            const { name, timestamp } = item;

            if (name === "LCP"){

                historicalData.push(item);

                if (checkDate(timestamp).isInLast24Hours()) {
                    last24HoursData.push(item);
                }

                if (checkDate(timestamp).isInLast7Days()) {
                    last7DaysData.push(item);
                }

                if (checkDate(timestamp).isInLast30Days()) {
                    last30DaysData.push(item);
                }

            }
    }}
    return { 
        lcpHistorical: historicalData, 
        lcp24Hours: last24HoursData, 
        lcp7Days: last7DaysData, 
        lcp30Days: last30DaysData 
    };
}