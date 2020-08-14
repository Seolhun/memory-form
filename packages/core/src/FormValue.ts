export type FormValueType<T = string> = T;

export interface FormValueOptionProps<T = string> {}

class FormValue<T = string> {
  private readonly _originValue: T;

  readonly options: FormValueOptionProps<T>;

  private _prevValue: T;

  private _value: T;

  error: string = '';

  constructor(value: FormValueType<T>, options: FormValueOptionProps<T>) {
    this._originValue = value;
    this.options = options;
    this._prevValue = value;
    this._value = value;
  }
  /**
   * @name GetterSetter
   */
  public get value(): T {
    return this._value;
  }

  public set value(newValue: T) {
    this._prevValue = this._value;
    this._value = newValue;
  }

  /**
   * @name State
   */

  /**
   * @name Options
   */

  /**
   * @name Methods
   */
  reset() {
    this.value = this._originValue;
    return this;
  }

  /**
   * @name Computed
   */
  public get isDirty(): boolean {
    return this._prevValue !== this._value;
  }

  public get hasError(): boolean {
    return !!this.error;
  }
}

export { FormValue };
export default FormValue;
