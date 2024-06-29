import type { WebVitalsResponseItem } from "studiocms-dashboard:web-vitals";
import { checkDate } from "./checkDate";

export const buildInpDataObject = (webVitalData: WebVitalsResponseItem[]) => {
    const historicalData: WebVitalsResponseItem[] = [];
    const last24HoursData: WebVitalsResponseItem[] = [];
    const last7DaysData: WebVitalsResponseItem[] = [];
    const last30DaysData: WebVitalsResponseItem[] = [];

    if (webVitalData) {
        for (const item of webVitalData) {
            const { name, timestamp } = item;

            if (name === "INP"){

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
        inpHistorical: historicalData, 
        inp24Hours: last24HoursData, 
        inp7Days: last7DaysData, 
        inp30Days: last30DaysData 
    };
}