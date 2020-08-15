abstract class AbstractMemoryValue<T = string> {
  readonly originValue: T;

  prevValue: T;

  currentValue: T;

  constructor(value: T) {
    this.originValue = Object.freeze(value);
    this.prevValue = value;
    this.currentValue = value;
  }

  public get isDirty(): boolean {
    return this.originValue !== this.currentValue;
  }

  /**
   * @name Methods
   */
  reset() {
    this.currentValue = this.originValue;
    return this;
  }

  isEqauls(newValue: T): boolean {
    return this.currentValue === newValue;
  }
}

export { AbstractMemoryValue };
export default AbstractMemoryValue;
