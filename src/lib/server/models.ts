export type JobsList = JobItem[]
export type OrderFlow = OrderFlowDefinition

export interface JobItem {
  job_title: string
  job_description: string
  company_name: string
  compensation_per_year: string
}

export interface OrderFlowDefinition{
  asks: LevelData[]
  highestAsk: LevelData,
  bids: LevelData[]
  highestBid: LevelData,
}

export interface LevelData {
  price: number;
  quantity: number;
}
