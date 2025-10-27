declare module "google-trends-api" {
  interface DailyTrendsOptions {
    trendDate?: Date;
    geo?: string;
  }

  interface RealTimeTrendsOptions {
    geo?: string;
    category?: string;
  }

  interface InterestOverTimeOptions {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string;
  }

  interface InterestByRegionOptions {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string;
    resolution?: string;
  }

  interface RelatedQueriesOptions {
    keyword: string;
    startTime?: Date;
    endTime?: Date;
    geo?: string;
  }

  interface RelatedTopicsOptions {
    keyword: string;
    startTime?: Date;
    endTime?: Date;
    geo?: string;
  }

  export function dailyTrends(options: DailyTrendsOptions): Promise<string>;
  export function realTimeTrends(
    options: RealTimeTrendsOptions
  ): Promise<string>;
  export function interestOverTime(
    options: InterestOverTimeOptions
  ): Promise<string>;
  export function interestByRegion(
    options: InterestByRegionOptions
  ): Promise<string>;
  export function relatedQueries(
    options: RelatedQueriesOptions
  ): Promise<string>;
  export function relatedTopics(options: RelatedTopicsOptions): Promise<string>;
}
