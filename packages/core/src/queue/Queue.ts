export interface Queue<T> {
  readonly queue: T[];

  readonly maxSize: number;

  value: T | null | undefined;

  size: number;

  isEmpty: boolean;

  isLast: boolean;

  push: Array<T>['push'];

  pop: Array<T>['pop'];

  shift: Array<T>['shift'];
}
