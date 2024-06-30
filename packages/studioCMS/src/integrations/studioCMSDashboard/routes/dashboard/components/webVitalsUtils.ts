import type { SlProgressRing } from "astrolace:types";
import type { WebVitalsResponseItem } from "studiocms-dashboard:web-vitals";

// Misc Utils
export function msToSeconds(ms: number): number {
    return ms / 1000;
}

// CLS Calculations
export function calculateClsAverage(clsValues: number[]): number {

    const sum = clsValues.reduce((acc, curr) => acc + curr, 0);
    const average = sum / clsValues.length;
    
    // Round average to two decimal places
    return Math.round(average * 100) / 100;
}

export const clsDataAverage = (webVitalData: WebVitalsResponseItem[]) => {
    const clsData: number[] = [];
    if (webVitalData) {
        for (const item of webVitalData) {
            if (item.name === "CLS") {
                clsData.push(item.value);
            }
        }
    }
    return calculateClsAverage(clsData);
};

export function calculateClsScoreText(cls: number): string {
    if (cls <= 0.1) {
        return "Excellent"; // Excellent
    }if (cls <= 0.25) {
        return "Good"; // Good to Excellent
    }if (cls <= 0.5) {
        return "Fair"; // Fair to Good
    }
    return "Poor"; // Poor to Fair
}

export function calculateClsScorePercent(cls: number): number {
    if (cls <= 0.1) {
        return 100; // Excellent
    }if (cls <= 0.25) {
        return Math.round(100 - ((cls - 0.1) / (0.25 - 0.1)) * 25); // Good to Excellent
    }if (cls <= 0.5) {
        return Math.round(75 - ((cls - 0.25) / (0.5 - 0.25)) * 25); // Fair to Good
    }
    return Math.round(50 - ((cls - 0.5) / (1 - 0.5)) * 50); // Poor to Fair
}

export const progressBarClsColor = (clsData: number) => {
    if (clsData <= 0.25) {
        return "green";
    }
    if (clsData > 0.25 && clsData <= 0.5) {
        return "yellow";
    }
    return "red";
}

export const progressBarClsTrackColor = (clsData: number) => {
    if (clsData <= 0.25) {
        return "yellow";
    }
    if (clsData > 0.25) {
        return "red";
    }
    return "red";
}

export const clsTextColor = (clsData: number) => {
    if (clsData <= 0.25) {
        return "green";
    }
    if (clsData > 0.25 && clsData <= 0.5) {
        return "yellow";
    }
    return "red";
}

// LCP Calculations
export function calculateLcpAverage(lcpValues: number[]): number {

    const sum = lcpValues.reduce((acc, curr) => acc + curr, 0);
    const average = sum / lcpValues.length;
    
    // Round average to two decimal places
    return Math.floor(Math.round(average * 100) / 100);
}

export const lcpDataAverage = (webVitalData: WebVitalsResponseItem[]) => {
    const lcpData: number[] = [];
    if (webVitalData) {
        for (const item of webVitalData) {
            if (item.name === "LCP") {
                lcpData.push(item.value);
            }
        }
    }
    return calculateLcpAverage(lcpData);
};

export function calculateLcpScoreText(lcp: number): string {
    if (msToSeconds(lcp) <= 2) {
        return "Excellent"; // Excellent
    }if (msToSeconds(lcp) <= 4) {
        return "Good"; // Good to Excellent
    }if (msToSeconds(lcp) <= 6) {
        return "Fair"; // Fair to Good
    }
    return "Poor"; // Poor to Fair
}

export function calculateLcpScorePercent(lcp: number): number {
    if (msToSeconds(lcp) <= 2) {
        return 100; // Excellent
    }if (msToSeconds(lcp) <= 4) {
        return Math.round(100 - ((lcp - 2) / (4 - 2)) * 50); // Good to Excellent
    }if (msToSeconds(lcp) <= 6) {
        return Math.round(50 - ((lcp - 4) / (6 - 4)) * 50); // Fair to Good
    }
        return Math.round(0 - ((lcp - 6) / (10 - 6)) * 50); // Poor to Fair
}

export const progressBarLcpColor = (lcpData: number) => {
    if (msToSeconds(lcpData) <= 2.5) {
        return "green";
    } 
    if (msToSeconds(lcpData) > 2.5 && lcpData <= 4) {
        return "yellow";
    } 
    return "red";
};

export const progressBarLcpTrackColor = (lcpData: number) => {
    if (msToSeconds(lcpData) <= 2.5) {
        return "yellow";
    } 
    if (msToSeconds(lcpData) > 2.5) {
        return "red";
    } 
    return "red";
};

export const lcpTextColor = (lcpData: number) => {
    if (msToSeconds(lcpData) <= 2.5) {
        return "green";
    } 
    if (msToSeconds(lcpData) > 2.5 && lcpData <= 4) {
        return "yellow";
    } 
    return "red";
};

// INP Calculations
export function calculateInpAverage(inpValues: number[]): number {

    const sum = inpValues.reduce((acc, curr) => acc + curr, 0);
    const average = sum / inpValues.length;
    
    // Round average to two decimal places
    return Math.round(average * 100) / 100;
}

export function inpDataAverage(webVitalData: WebVitalsResponseItem[]): number {
    const inpData: number[] = [];
    if (webVitalData) {
        for (const item of webVitalData) {
            if (item.name === "INP") {
                inpData.push(item.value);
            }
        }
    }
    return Math.floor(calculateInpAverage(inpData));
}

export function calculateInpScoreText(inp: number): string {
    if (inp <= 50) {
        return "Excellent"; // Excellent
    }if (inp <= 100) {
        return "Good"; // Good to Excellent
    }if (inp <= 200) {
        return "Fair"; // Fair to Good
    }
    return "Poor"; // Poor to Fair
}

export function calculateInpScorePercent(inp: number): number {
    if (inp <= 50) {
        return 100; // Excellent
    }if (inp <= 100) {
        return Math.round(100 - ((inp - 50) / (100 - 50)) * 50); // Good to Excellent
    }if (inp <= 200) {
        return Math.round(50 - ((inp - 100) / (200 - 100)) * 50); // Fair to Good
    }
    return Math.round(0 - ((inp - 200) / (300 - 200)) * 50); // Poor to Fair
}

export const progressBarInpColor = (inpData: number) => {
    if (inpData <= 100) {
        return "green";
    } 
    if (inpData > 100 && inpData <= 200) {
        return "yellow";
    } 
    return "red";
};

export const progressBarInpTrackColor = (inpData: number) => {
    if (inpData <= 100) {
        return "yellow";
    } 
    if (inpData > 100) {
        return "red";
    } 
    return "red";
};

export const inpTextColor = (inpData: number) => {
    if (inpData <= 100) {
        return "green";
    } 
    if (inpData > 100 && inpData <= 200) {
        return "yellow";
    } 
    return "red";
};

//
// Pagespeed Insights Utils
//
export function generateLighthouseFetchUrl(url: string, strategy: 'mobile' | 'desktop' | 'mixed-content' = 'mobile'): string {
    // Base URL for Google PageSpeed Insights API
    const baseUrl: string = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    
    // Final URL with encoded parameters
    const fetchUrl: string = `${baseUrl}?url=${encodeURIComponent(url)}&fields=lighthouseResult%2Fcategories%2F*%2Fscore&prettyPrint=false&strategy=${strategy}&category=performance&category=pwa&category=best-practices&category=accessibility&category=seo`;
    
    return fetchUrl;
}

export const setProgressRing = ( ProgressRing: SlProgressRing, value: number ) => {
    ProgressRing.value = value;
    ProgressRing.textContent = value.toString();
    ProgressRing.style.color = value >= 90 ? 'green' : value >= 50 ? 'rgb(208, 208, 0)' : 'red';
    ProgressRing.style.setProperty("--indicator-color", value >= 90 ? 'green' : value >= 50 ? 'yellow' : 'red');
    if (value < 90) {
        ProgressRing.style.webkitTextStroke = '2px black;'
    }
}