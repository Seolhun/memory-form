export type FormValueType<T = string> = T;

export interface FormValueOptionProps<T = string> {
  /**
   * @default false
   * @description This props is to check the init value validation.
   */
  initValidation?: boolean;

  /**
   * @default undefined
   * @description This props is to change the value
   */
  onChange?: (newValue: T) => void;

  /**
   * @default undefined
   * @description This props is to change the value validation
   */
  onValidation?: (newValue: T) => string;
}

class FormValue<T = string> {
  private readonly _originValue: T;

  readonly options: FormValueOptionProps<T>;

  private _prevValue: T;

  private _value: T;

  error: string = '';

  constructor(value: FormValueType<T>, options?: FormValueOptionProps<T>) {
    this._originValue = Object.freeze(value);
    this.options = Object.freeze(options || {});
    this._prevValue = value;
    this._value = value;
    if (this.options.initValidation) {
      this.handleValidation(value);
    }
  }

  /**
   * @name Methods
   */
  reset() {
    this.value = this._originValue;
    return this;
  }

  private handleValue(newValue: T) {
    if (this.options.onChange) {
      this.options.onChange(newValue);
    }
    return this;
  }

  private handleValidation(newValue: T) {
    if (this.options.onValidation) {
      this.error = this.options.onValidation(newValue);
    }
    return this;
  }

  /**
   * @name GetterSetter
   */
  public set value(newValue: T) {
    this._prevValue = this._value;
    this._value = newValue;
    this.handleValue(newValue).handleValidation(newValue);
  }

  public get value(): T {
    return this._value;
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
