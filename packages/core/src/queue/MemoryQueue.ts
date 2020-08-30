import { Queue } from './Queue';
import AbstractQueue from './AbstractQueue';
import ArrayQueue from './ArrayQueue';

class MemoryQueue<T> extends AbstractQueue<T> implements Queue<T> {
  private histories: ArrayQueue<T>;

  constructor(items: T[] = [], maxSize: number = 20) {
    super(items, maxSize);
    this.histories = new ArrayQueue<T>();
  }

  /**
   * @name Methods
   */
  undo(currentItem: T) {
    if (!this.isEmpty) {
      const item = this.pop();
      if (item) {
        this.histories.push(currentItem);
        return item;
      }
    }
    return null;
  }

  redo() {
    if (!this.histories.isEmpty) {
      const item = this.histories.pop();
      if (item) {
        return item;
      }
    }
    return null;
  }
}

export { MemoryQueue };
export default MemoryQueue;
