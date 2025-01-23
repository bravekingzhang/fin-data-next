import { Scheduler } from './scheduler';
import { generateIndustryData, generateETFData, generateStockData } from './mockData';
import { DataPoint } from '@/types/financial';

class DataManager {
  private static instance: DataManager;
  private scheduler: Scheduler;
  private data: Map<string, DataPoint[]>;

  private constructor() {
    this.scheduler = new Scheduler();
    this.data = new Map();
    this.initializeScheduler();
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private initializeScheduler() {
    // Update industry data every 30 minutes
    this.scheduler.addTask('industry', async () => {
      const data = generateIndustryData(30);
      this.data.set('industry', data);
    }, 30);

    // Update ETF data every 15 minutes
    this.scheduler.addTask('etf', async () => {
      const data = generateETFData(30);
      this.data.set('etf', data);
    }, 15);

    // Update stock data every 5 minutes
    this.scheduler.addTask('stock', async () => {
      const data = generateStockData(30);
      this.data.set('stock', data);
    }, 5);
  }

  getData(type: string): DataPoint[] {
    return this.data.get(type) || [];
  }

  updateDataStatus(id: string, status: 'normal' | 'anomaly' | 'fixed'): boolean {
    for (const [type, dataPoints] of this.data.entries()) {
      const index = dataPoints.findIndex(point => point.id === id);
      if (index !== -1) {
        dataPoints[index].status = status;
        this.data.set(type, dataPoints);
        return true;
      }
    }
    return false;
  }

  stopScheduler() {
    this.scheduler.stopAll();
  }
}

export const dataManager = DataManager.getInstance(); 