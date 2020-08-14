abstract class AbstractMemoryValue<T = string> {
  readonly _originValue: T;

  _prevValue: T;

  _value: T;

  constructor(value: T) {
    this._originValue = Object.freeze(value);
    this._prevValue = value;
    this._value = value;
  }

  /**
   * @name Methods
   */
  reset() {
    this.value = this._originValue;
    return this;
  }

  /**
   * @name GetterSetter
   */
  public set value(newValue: T) {
    this._prevValue = this._value;
    this._value = newValue;
  }

  public get value() {
    return this._value;
  }

  /**
   * @name Computed
   */
  public get isDirty(): boolean {
    return this._originValue !== this.value;
  }
}

export { AbstractMemoryValue };
export default AbstractMemoryValue;
