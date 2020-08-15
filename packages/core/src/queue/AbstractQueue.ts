import { Queue } from './Queue';

abstract class AbstractQueue<T> implements Queue<T> {
  readonly queue: T[];

  readonly maxSize: number;

  constructor(items: T[] = [], maxSize: number = 20) {
    this.queue = items;
    this.maxSize = maxSize;
  }

  /**
   * @name Computed
   */
  public get value(): T | null | undefined {
    if (this.isEmpty) {
      return null;
    }
    return this.queue[0];
  }

  public get size(): number {
    return this.queue.length;
  }

  public get isEmpty(): boolean {
    return this.size === 0;
  }

  public get isLast(): boolean {
    return this.size === this.maxSize;
  }

  /**
   * @name Methods
   */
  private toClear(...items: T[]) {
    if (this.isLast) {
      for (let index = 0; index < items.length; index++) {
        this.queue.shift();
      }
    }
    return this;
  }

  push(...items: T[]) {
    return this.toClear(...items).queue.push(...items);
  }

  pop() {
    return this.queue.pop();
  }

  shift() {
    return this.queue.shift();
  }
}

export { AbstractQueue };
export default AbstractQueue;
