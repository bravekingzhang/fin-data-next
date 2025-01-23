type Task = () => Promise<void>;

export class Scheduler {
  private tasks: Map<string, { task: Task; interval: number }> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  addTask(id: string, task: Task, intervalMinutes: number) {
    this.tasks.set(id, { task, interval: intervalMinutes * 60 * 1000 });
    this.startTask(id);
  }

  private async startTask(id: string) {
    const taskInfo = this.tasks.get(id);
    if (!taskInfo) return;

    const { task, interval } = taskInfo;

    // Run immediately
    try {
      await task();
    } catch (error) {
      console.error(`Error running task ${id}:`, error);
    }

    // Schedule periodic runs
    const intervalId = setInterval(async () => {
      try {
        await task();
      } catch (error) {
        console.error(`Error running task ${id}:`, error);
      }
    }, interval);

    this.intervals.set(id, intervalId);
  }

  stopTask(id: string) {
    const intervalId = this.intervals.get(id);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(id);
    }
  }

  stopAll() {
    for (const id of this.intervals.keys()) {
      this.stopTask(id);
    }
  }
} 