import { Queue } from './Queue';
import AbstractQueue from './AbstractQueue';

class HistoryQueue<T> extends AbstractQueue<T> implements Queue<T> {
  constructor(items: T[] = [], maxSize: number = 20) {
    super(items, maxSize);
  }
}
export { HistoryQueue };
export default HistoryQueue;
