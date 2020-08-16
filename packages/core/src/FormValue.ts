export interface FormValueOptionProps<T = string> {
  /**
   * @default "() => ''"
   * @description This props is to change the value validation
   */
  onValidation?: (newValue: T) => string;

  /**
   * @default false
   * @description This props is to check the init value validation.
   */
  initValidation?: boolean;
}

class FormValue<T = string> {
  readonly options: FormValueOptionProps<T>;

  readonly originValue: T;

  prevValue: T;

  currentValue: T;

  error: string = '';

  constructor(value: T, options?: FormValueOptionProps<T>) {
    this.originValue = Object.freeze(value);
    this.prevValue = value;
    this.currentValue = value;
    this.options = Object.freeze(options || {});
    if (this.options.initValidation) {
      this._handleValidation(value);
    }
  }
  /**
   * @name Computed
   */
  public set value(newValue: T) {
    this.prevValue = this.currentValue;
    this.currentValue = newValue;
    this._handleValidation(newValue);
  }

  public get value() {
    return this.currentValue;
  }

  public get hasError(): boolean {
    return !!this.error;
  }

  public get isDirty(): boolean {
    return this.originValue !== this.currentValue;
  }

  /**
   * @name Methods
   */
  private _handleValidation(newValue: T) {
    if (this.options.onValidation) {
      this.error = this.options.onValidation(newValue);
    }
    return this;
  }

  reset() {
    this.currentValue = this.originValue;
    return this;
  }

  isEqauls(newValue: T): boolean {
    return this.currentValue === newValue;
  }

  toValue() {
    return {
      originValue: this.originValue,
      prevValue: this.prevValue,
      value: this.currentValue,
      error: this.error,
      isDirty: this.isDirty,
    };
  }
}

export { FormValue };
export default FormValue;
