import { IndustryIndex, ETFData, StockData, DataPoint } from '../types/financial';
import { v4 as uuidv4 } from 'uuid';

const INDUSTRY_INDICES = [
  { symbol: 'S5COND.SPI', name: 'Consumer Discretionary' },
  { symbol: 'S5MATR.SPI', name: 'Materials' },
  { symbol: 'SPF.SPI', name: 'Financials' },
  { symbol: 'SPN.SPI', name: 'Energy' },
  { symbol: 'S5INDU.SPI', name: 'Industrials' },
  { symbol: 'NDX.GI', name: 'NASDAQ 100' },
  { symbol: 'DJI.GI', name: 'Dow Jones Industrial' },
  { symbol: 'SPX.GI', name: 'S&P 500' },
];

const ETF_SYMBOLS = [
  { symbol: 'XLE.P', name: 'Energy Select Sector SPDR' },
  { symbol: 'VDE.P', name: 'Vanguard Energy ETF' },
  { symbol: 'XLB.P', name: 'Materials Select Sector SPDR' },
  { symbol: 'XLI.P', name: 'Industrial Select Sector SPDR' },
  { symbol: 'XLY.P', name: 'Consumer Discretionary Select SPDR' },
  { symbol: 'XLF.P', name: 'Financial Select Sector SPDR' },
  { symbol: 'SPY.P', name: 'SPDR S&P 500 ETF' },
];

function randomNumber(min: number, max: number, nullable: boolean = false): number | null {
  if (nullable && Math.random() < 0.05) return null;
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function generateDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

export function generateIndustryData(days: number = 30): DataPoint[] {
  const dates = generateDateRange(days);
  const data: DataPoint[] = [];

  INDUSTRY_INDICES.forEach(index => {
    dates.forEach(date => {
      const industryData: IndustryIndex = {
        date,
        symbol: index.symbol,
        name: index.name,
        pe_ttm: randomNumber(10, 30, true),
        pb_lyr: randomNumber(1, 5, true),
        ps_ttm: randomNumber(1, 10, true),
        dividend_yield: randomNumber(1, 5, true),
        percentiles: {
          pe_ttm: randomNumber(0, 100, false) ?? 0,
          pb_lyr: randomNumber(0, 100, false) ?? 0,
          ps_ttm: randomNumber(0, 100, false) ?? 0,
          dividend_yield: randomNumber(0, 100, false) ?? 0,
        },
      };

      data.push({
        id: uuidv4(),
        timestamp: date,
        status: Math.random() < 0.1 ? 'anomaly' : 'normal',
        type: 'industry',
        data: industryData,
      });
    });
  });

  return data;
}

export function generateETFData(days: number = 30): DataPoint[] {
  const dates = generateDateRange(days);
  const data: DataPoint[] = [];

  ETF_SYMBOLS.forEach(etf => {
    dates.forEach(date => {
      const basePrice = randomNumber(100, 400, false) ?? 200;
      const etfData: ETFData = {
        date,
        symbol: etf.symbol,
        name: etf.name,
        setup_date: '2010-01-01',
        open: basePrice,
        close: basePrice * (1 + (randomNumber(-0.02, 0.02, false) ?? 0)),
        high: basePrice * (1 + (randomNumber(0.01, 0.03, false) ?? 0)),
        low: basePrice * (1 - (randomNumber(0.01, 0.03, false) ?? 0)),
        pre_close: basePrice * (1 + (randomNumber(-0.02, 0.02, false) ?? 0)),
        volume: Math.floor(randomNumber(100000, 1000000, false) ?? 500000),
        returns: {
          '1m': randomNumber(-10, 10, false) ?? 0,
          '3m': randomNumber(-15, 15, false) ?? 0,
          '6m': randomNumber(-20, 20, false) ?? 0,
          '1y': randomNumber(-30, 30, false) ?? 0,
          '1y_excess': randomNumber(-10, 10, false) ?? 0,
          '2y_excess': randomNumber(-15, 15, false) ?? 0,
          '3y_excess': randomNumber(-20, 20, false) ?? 0,
        },
      };

      data.push({
        id: uuidv4(),
        timestamp: date,
        status: Math.random() < 0.1 ? 'anomaly' : 'normal',
        type: 'etf',
        data: etfData,
      });
    });
  });

  return data;
}

export function generateStockData(days: number = 30): DataPoint[] {
  const dates = generateDateRange(days);
  const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'];
  const data: DataPoint[] = [];

  stocks.forEach(symbol => {
    dates.forEach(date => {
      const basePrice = randomNumber(100, 1000, false) ?? 500;
      const stockData: StockData = {
        date,
        symbol,
        ipo_date: '2000-01-01',
        market_cap: randomNumber(100000000000, 3000000000000, false) ?? 1000000000000,
        open: basePrice,
        close: basePrice * (1 + (randomNumber(-0.02, 0.02, false) ?? 0)),
        high: basePrice * (1 + (randomNumber(0.01, 0.03, false) ?? 0)),
        low: basePrice * (1 - (randomNumber(0.01, 0.03, false) ?? 0)),
        pre_close: basePrice * (1 + (randomNumber(-0.02, 0.02, false) ?? 0)),
        volume: Math.floor(randomNumber(1000000, 10000000, false) ?? 5000000),
        pe_ttm: randomNumber(15, 50, true),
        dividend_yield: randomNumber(0, 3, true),
        yoy_revenue_growth: randomNumber(-10, 30, true),
      };

      data.push({
        id: uuidv4(),
        timestamp: date,
        status: Math.random() < 0.1 ? 'anomaly' : 'normal',
        type: 'stock',
        data: stockData,
      });
    });
  });

  return data;
} 