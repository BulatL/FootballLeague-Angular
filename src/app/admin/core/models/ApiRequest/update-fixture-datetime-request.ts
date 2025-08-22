export interface UpdateFixtureDateTimeRequest {
    fixtureId: number;
    dateTime: string; // Send as string to avoid timezone conversion (format: "YYYY-MM-DDTHH:mm:ss")
}