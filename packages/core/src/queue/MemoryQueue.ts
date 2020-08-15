import { Queue } from './Queue';
import AbstractQueue from './AbstractQueue';

class MemoryQueue<T> extends AbstractQueue<T> implements Queue<T> {
  constructor(items: T[] = [], maxSize: number = 20) {
    super(items, maxSize);
  }

  /**
   * @name Methods
   */
  undo(currentItem: T) {
    if (!this.isEmpty) {
      const item = this.pop();
      if (item) {
        this.push(currentItem);
        return item;
      }
    }
    return null;
  }

  redo(currentItem: T) {
    if (!this.isEmpty) {
      const item = this.pop();
      if (item) {
        this.push(currentItem);
        return item;
      }
    }
    return null;
  }
}

export { MemoryQueue };
export default MemoryQueue;
