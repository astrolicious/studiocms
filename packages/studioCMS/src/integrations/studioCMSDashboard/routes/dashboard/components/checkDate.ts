
export const checkDate = () => {
    return {
        isInLast24Hours(date: Date): boolean {
            const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000)); // Subtract 24 hours in milliseconds
            return date >= twentyFourHoursAgo && date <= new Date();
        },
        isInLast7Days(date: Date): boolean {
            const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)); // Subtract 7 days in milliseconds
            return date >= sevenDaysAgo && date <= new Date();
        },
        isInLast30Days(date: Date): boolean {
            const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)); // Subtract 30 days in milliseconds
            return date >= thirtyDaysAgo && date <= new Date();
        }
    }
}