export type ProcessingPriority = 'critical' | 'high' | 'medium' | 'low';
export type ProcessingType = 'real-time' | 'batch';

export interface ProcessingTask {
  id: string;
  type: ProcessingType;
  priority: ProcessingPriority;
  timestamp: number;
  data: any;
  handler: (data: any) => Promise<any>;
  retries: number;
  maxRetries: number;
}

class ProcessingQueue {
  private realTimeQueue: ProcessingTask[] = [];
  private batchQueue: ProcessingTask[] = [];
  private processing: boolean = false;
  private batchInterval: NodeJS.Timeout | null = null;
  private stats = {
    processed: 0,
    failed: 0,
    queued: 0,
  };

  constructor() {
    this.startBatchProcessing();
  }

  // Add task to queue
  enqueue(task: ProcessingTask): void {
    task.id = task.id || `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    task.timestamp = task.timestamp || Date.now();
    task.retries = task.retries || 0;
    task.maxRetries = task.maxRetries || 3;

    if (task.type === 'real-time' || task.priority === 'critical') {
      // Insert based on priority
      const index = this.realTimeQueue.findIndex(
        t => this.getPriorityWeight(t.priority) < this.getPriorityWeight(task.priority)
      );
      if (index === -1) {
        this.realTimeQueue.push(task);
      } else {
        this.realTimeQueue.splice(index, 0, task);
      }
      this.stats.queued++;
      this.processRealTime();
    } else {
      this.batchQueue.push(task);
      this.stats.queued++;
    }
  }

  // Get priority weight for sorting
  private getPriorityWeight(priority: ProcessingPriority): number {
    switch (priority) {
      case 'critical': return 0;
      case 'high': return 1;
      case 'medium': return 2;
      case 'low': return 3;
      default: return 2;
    }
  }

  // Process real-time queue
  private async processRealTime(): Promise<void> {
    if (this.processing || this.realTimeQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.realTimeQueue.length > 0) {
      const task = this.realTimeQueue.shift();
      if (!task) break;

      try {
        await task.handler(task.data);
        this.stats.processed++;
      } catch (error) {
        console.error('Task processing error:', error);
        task.retries++;
        if (task.retries < task.maxRetries) {
          // Retry with exponential backoff
          setTimeout(() => {
            this.enqueue(task);
          }, Math.pow(2, task.retries) * 1000);
        } else {
          this.stats.failed++;
        }
      }
    }

    this.processing = false;
  }

  // Start batch processing
  private startBatchProcessing(): void {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }

    this.batchInterval = setInterval(() => {
      this.processBatch();
    }, 60000); // Process batch every 60 seconds (reduced frequency to avoid rate limits)
  }

  // Process batch queue
  private async processBatch(): Promise<void> {
    if (this.batchQueue.length === 0) {
      return;
    }

    // Process up to 1 task per batch (very conservative to avoid rate limits)
    const tasks = this.batchQueue.splice(0, 1);

    for (const task of tasks) {
      try {
        await task.handler(task.data);
        this.stats.processed++;
      } catch (error) {
        console.error('Batch task processing error:', error);
        task.retries++;
        if (task.retries < task.maxRetries) {
          this.batchQueue.push(task);
        } else {
          this.stats.failed++;
        }
      }
    }
  }

  // Get queue statistics
  getStats() {
    return {
      ...this.stats,
      realTimeQueueLength: this.realTimeQueue.length,
      batchQueueLength: this.batchQueue.length,
      processing: this.processing,
    };
  }

  // Clear queues
  clear(): void {
    this.realTimeQueue = [];
    this.batchQueue = [];
    this.stats = {
      processed: 0,
      failed: 0,
      queued: 0,
    };
  }

  // Stop processing
  stop(): void {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
    this.clear();
  }
}

// Singleton instance
export const processingQueue = new ProcessingQueue();

