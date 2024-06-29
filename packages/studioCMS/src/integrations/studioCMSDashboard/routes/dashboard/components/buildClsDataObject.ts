import type { WebVitalsResponseItem } from "studiocms-dashboard:web-vitals";
import { checkDate } from "./checkDate";

export const buildClsDataObject = (webVitalData: WebVitalsResponseItem[]) => {
    const historicalData: WebVitalsResponseItem[] = [];
    const last24HoursData: WebVitalsResponseItem[] = [];
    const last7DaysData: WebVitalsResponseItem[] = [];
    const last30DaysData: WebVitalsResponseItem[] = [];

    if (webVitalData) {
        for (const item of webVitalData) {
            const { name, timestamp } = item;

            if (name === "CLS"){

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
        clsHistorical: historicalData, 
        cls24Hours: last24HoursData, 
        cls7Days: last7DaysData, 
        cls30Days: last30DaysData 
    };
}