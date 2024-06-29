import type { WebVitalsResponseItem } from "studiocms-dashboard:web-vitals";
import { checkDate } from "./checkDate";

export type perPageDataEntry = {
    pageRoute: string;
    sampleSize: number;
    CLS: {
        average: number;
        rating: string;
    };
    LCP: {
        average: number;
        rating: string;
    };
    INP: {
        average: number;
        rating: string;
    };
};


function calculateClsAverage(clsValues: number[]): number {

    const sum = clsValues.reduce((acc, curr) => acc + curr, 0);
    const average = sum / clsValues.length;
    
    // Round average to two decimal places
    return Math.round(average * 100) / 100;
}

const clsDataAverage = (clsData: number[]) => {
    return calculateClsAverage(clsData);
};

function calculateClsScore(cls: number): string {
    if (cls <= 0.1) {
        return "Excellent"; // Excellent
    }if (cls <= 0.25) {
        return "Good"; // Good to Excellent
    }if (cls <= 0.5) {
        return "Fair"; // Fair to Good
    }
    return "Poor"; // Poor to Fair
}

function calculateLcpAverage(lcpValues: number[]): number {
    if (lcpValues.length === 0) {
        throw new Error("Array must not be empty.");
    }

    const sum = lcpValues.reduce((acc, curr) => acc + curr, 0);
    const average = sum / lcpValues.length;
    
    // Round average to two decimal places
    return Math.round(average * 100) / 100;
}

const lcpDataAverage = (lcpData: number[]) => {
    return Math.floor(calculateLcpAverage(lcpData));
};

function msToSeconds(ms: number): number {
    return ms / 1000;
}

function calculateLcpScore(lcp: number): string {
    if (msToSeconds(lcp) <= 2) {
        return "Excellent"; // Excellent
    }if (msToSeconds(lcp) <= 4) {
        return "Good"; // Good to Excellent
    }if (msToSeconds(lcp) <= 6) {
        return "Fair"; // Fair to Good
    }
    return "Poor"; // Poor to Fair
}

function calculateInpAverage(inpValues: number[]): number {

    const sum = inpValues.reduce((acc, curr) => acc + curr, 0);
    const average = sum / inpValues.length;
    
    // Round average to two decimal places
    return Math.round(average * 100) / 100;
}

function inpDataAverage(inpData: number[]): number {
    return Math.floor(calculateInpAverage(inpData));
}

function calculateInpScore(inp: number): string {
    if (inp <= 50) {
        return "Excellent"; // Excellent
    }if (inp <= 100) {
        return "Good"; // Good to Excellent
    }if (inp <= 200) {
        return "Fair"; // Fair to Good
    }
    return "Poor"; // Poor to Fair
}

type RouteArrayEntry = { 
    route: string, 
    samplesize: number, 
    clsvalue: number[],
    lcpvalue: number[],
    inpvalue: number[], 
};

export const buildPageRouteDataObject = (webVitalData: WebVitalsResponseItem[]) => {
    const RouteArray: RouteArrayEntry[] = [];
    const last24HoursData: RouteArrayEntry[] = [];
    const last7DaysData: RouteArrayEntry[] = [];
    const last30DaysData: RouteArrayEntry[] = [];

    if (webVitalData.length > 0) {

        for (const item of webVitalData) {
            const { route, timestamp } = item;

            if (checkDate(timestamp).isInLast24Hours()) {
                const index = last24HoursData.findIndex((entry) => entry.route === route);
    
                if (index !== -1) {
                    // @ts-expect-error - This is a valid index
                    last24HoursData[index].samplesize += 1;
                    if (item.name === "CLS") {
                        // @ts-expect-error - This is a valid index
                        last24HoursData[index].clsvalue.push(item.value);
                    }
                    if (item.name === "LCP") {
                        // @ts-expect-error - This is a valid index
                        last24HoursData[index].lcpvalue.push(item.value);
                    }
                    if (item.name === "INP") {
                        // @ts-expect-error - This is a valid index
                        last24HoursData[index].inpvalue.push(item.value);
                    }
                } else {
                    last24HoursData.push({
                        route,
                        samplesize: 1,
                        clsvalue: item.name === "CLS" ? [item.value] : [],
                        lcpvalue: item.name === "LCP" ? [item.value] : [],
                        inpvalue: item.name === "INP" ? [item.value] : [],
                    });
                }
            }
            if (checkDate(timestamp).isInLast7Days()) {
                const index = last7DaysData.findIndex((entry) => entry.route === route);
    
                if (index !== -1) {
                    // @ts-expect-error - This is a valid index
                    last7DaysData[index].samplesize += 1;
                    if (item.name === "CLS") {
                        // @ts-expect-error - This is a valid index
                        last7DaysData[index].clsvalue.push(item.value);
                    }
                    if (item.name === "LCP") {
                        // @ts-expect-error - This is a valid index
                        last7DaysData[index].lcpvalue.push(item.value);
                    }
                    if (item.name === "INP") {
                        // @ts-expect-error - This is a valid index
                        last7DaysData[index].inpvalue.push(item.value);
                    }
                } else {
                    last7DaysData.push({
                        route,
                        samplesize: 1,
                        clsvalue: item.name === "CLS" ? [item.value] : [],
                        lcpvalue: item.name === "LCP" ? [item.value] : [],
                        inpvalue: item.name === "INP" ? [item.value] : [],
                    });
                }
            }
            if (checkDate(timestamp).isInLast30Days()) {
                const index = last30DaysData.findIndex((entry) => entry.route === route);
    
                if (index !== -1) {
                    // @ts-expect-error - This is a valid index
                    last30DaysData[index].samplesize += 1;
                    if (item.name === "CLS") {
                        // @ts-expect-error - This is a valid index
                        last30DaysData[index].clsvalue.push(item.value);
                    }
                    if (item.name === "LCP") {
                        // @ts-expect-error - This is a valid index
                        last30DaysData[index].lcpvalue.push(item.value);
                    }
                    if (item.name === "INP") {
                        // @ts-expect-error - This is a valid index
                        last30DaysData[index].inpvalue.push(item.value);
                    }
                } else {
                    last30DaysData.push({
                        route,
                        samplesize: 1,
                        clsvalue: item.name === "CLS" ? [item.value] : [],
                        lcpvalue: item.name === "LCP" ? [item.value] : [],
                        inpvalue: item.name === "INP" ? [item.value] : [],
                    });
                }
            }

            const index = RouteArray.findIndex((entry) => entry.route === route);

            if (index !== -1) {
                // @ts-expect-error - This is a valid index
                RouteArray[index].samplesize += 1;
                if (item.name === "CLS") {
                    // @ts-expect-error - This is a valid index
                    RouteArray[index].clsvalue.push(item.value);
                }
                if (item.name === "LCP") {
                    // @ts-expect-error - This is a valid index
                    RouteArray[index].lcpvalue.push(item.value);
                }
                if (item.name === "INP") {
                    // @ts-expect-error - This is a valid index
                    RouteArray[index].inpvalue.push(item.value);
                }
            } else {
                RouteArray.push({
                    route,
                    samplesize: 1,
                    clsvalue: item.name === "CLS" ? [item.value] : [],
                    lcpvalue: item.name === "LCP" ? [item.value] : [],
                    inpvalue: item.name === "INP" ? [item.value] : [],
                });
            }

        }

        const perPageData: perPageDataEntry[] = [];
        const last24HoursPerPageData: perPageDataEntry[] = [];
        const last7DaysPerPageData: perPageDataEntry[] = [];
        const last30DaysPerPageData: perPageDataEntry[] = [];


        for (const item of RouteArray) {
            const { route, samplesize, clsvalue, lcpvalue, inpvalue } = item;

            const clsAverage = clsDataAverage(clsvalue);
            const lcpAverage = lcpDataAverage(lcpvalue);
            const inpAverage = inpDataAverage(inpvalue);

            perPageData.push({
                pageRoute: route,
                sampleSize: samplesize,
                CLS: {
                    average: clsAverage,
                    rating: calculateClsScore(clsAverage),
                },
                LCP: {
                    average: lcpAverage,
                    rating: calculateLcpScore(lcpAverage),
                },
                INP: {
                    average: inpAverage,
                    rating: calculateInpScore(inpAverage),
                },
            });
        }

        for (const item of last24HoursData) {
            const { route, samplesize, clsvalue, lcpvalue, inpvalue } = item;

            const clsAverage = clsDataAverage(clsvalue);
            const lcpAverage = lcpDataAverage(lcpvalue);
            const inpAverage = inpDataAverage(inpvalue);

            last24HoursPerPageData.push({
                pageRoute: route,
                sampleSize: samplesize,
                CLS: {
                    average: clsAverage,
                    rating: calculateClsScore(clsAverage),
                },
                LCP: {
                    average: lcpAverage,
                    rating: calculateLcpScore(lcpAverage),
                },
                INP: {
                    average: inpAverage,
                    rating: calculateInpScore(inpAverage),
                },
            });
        }

        for (const item of last7DaysData) {
            const { route, samplesize, clsvalue, lcpvalue, inpvalue } = item;

            const clsAverage = clsDataAverage(clsvalue);
            const lcpAverage = lcpDataAverage(lcpvalue);
            const inpAverage = inpDataAverage(inpvalue);

            last7DaysPerPageData.push({
                pageRoute: route,
                sampleSize: samplesize,
                CLS: {
                    average: clsAverage,
                    rating: calculateClsScore(clsAverage),
                },
                LCP: {
                    average: lcpAverage,
                    rating: calculateLcpScore(lcpAverage),
                },
                INP: {
                    average: inpAverage,
                    rating: calculateInpScore(inpAverage),
                },
            });
        }

        for (const item of last30DaysData) {
            const { route, samplesize, clsvalue, lcpvalue, inpvalue } = item;

            const clsAverage = clsDataAverage(clsvalue);
            const lcpAverage = lcpDataAverage(lcpvalue);
            const inpAverage = inpDataAverage(inpvalue);

            last30DaysPerPageData.push({
                pageRoute: route,
                sampleSize: samplesize,
                CLS: {
                    average: clsAverage,
                    rating: calculateClsScore(clsAverage),
                },
                LCP: {
                    average: lcpAverage,
                    rating: calculateLcpScore(lcpAverage),
                },
                INP: {
                    average: inpAverage,
                    rating: calculateInpScore(inpAverage),
                },
            });
        }

        return {
            historicalData: perPageData,
            last24HoursData: last24HoursPerPageData,
            last7DaysData: last7DaysPerPageData,
            last30DaysData: last30DaysPerPageData,
        };

    }
    return {
        historicalData: [],
        last24HoursData: [],
        last7DaysData: [],
        last30DaysData: [],
    };
}