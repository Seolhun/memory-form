export type FormValueType<T = string> = T;

export interface FormValueOptionProps<T = string> {}

class FormValue<T = string> {
  private _prevValue: T;

  private _value: T;

  error: string = '';

  constructor(value: FormValueType<T>, options: FormValueOptionProps<T>) {
    this.setValue(value);
  }

  private setValue(value: T) {
    this._prevValue = this.value;
    this._value = value;
  }

  /**
   * @name Methods
   */

  /**
   * @name Computed
   */
  public get value(): T {
    return this.value;
  }

  public get isDirty(): boolean {
    return this.prevValue !== this.value;
  }

  public get hasError(): boolean {
    return !!this.error;
  }
}

export { FormValue };
export default FormValue;
