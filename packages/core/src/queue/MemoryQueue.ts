import { Queue } from './Queue';
import HistoryQueue from './HistoryQueue';
import AbstractQueue from './AbstractQueue';

class MemoryQueue<T> extends AbstractQueue<T> implements Queue<T> {
  private readonly histories: Queue<T>;

  constructor(items: T[] = [], maxSize: number = 20) {
    super(items, maxSize);
    this.histories = new HistoryQueue([], maxSize);
  }

  /**
   * @name Methods
   */
  push(...items: T[]) {
    this.histories.push(...items);
    return this.queue.push(...items);
  }
}

export { MemoryQueue };
export default MemoryQueue;
