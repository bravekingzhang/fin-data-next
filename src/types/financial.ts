export type IndustryIndex = {
  date: string;
  symbol: string;
  name: string;
  pe_ttm: number | null;
  pb_lyr: number | null;
  ps_ttm: number | null;
  dividend_yield: number | null;
  percentiles?: {
    pe_ttm: number;
    pb_lyr: number;
    ps_ttm: number;
    dividend_yield: number;
  };
};

export type ETFData = {
  date: string;
  symbol: string;
  name: string;
  setup_date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  pre_close: number;
  volume: number;
  returns?: {
    '1m': number;
    '3m': number;
    '6m': number;
    '1y': number;
    '1y_excess': number;
    '2y_excess': number;
    '3y_excess': number;
  };
};

export type StockData = {
  date: string;
  symbol: string;
  ipo_date: string;
  market_cap: number;
  open: number;
  close: number;
  high: number;
  low: number;
  pre_close: number;
  volume: number;
  pe_ttm: number | null;
  dividend_yield: number | null;
  yoy_revenue_growth: number | null;
};

export type DataStatus = 'normal' | 'anomaly' | 'fixed';

export interface DataPoint {
  id: string;
  timestamp: string;
  status: DataStatus;
  type: 'industry' | 'etf' | 'stock';
  data: IndustryIndex | ETFData | StockData;
}
