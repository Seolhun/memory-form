export interface FormValueValodationProps<T = string> {
  /**
   * @default false
   * @description This props is to check the init value validation.
   */
  initValidation?: boolean;

  /**
   * @default "() => ''"
   * @description This props is to change the value validation
   */
  onValidation?: (newValue: T, formValues?: FormValueToValueResponse<T>) => string;
}

export interface FormValueToValueResponse<T> {
  originValue: T;
  prevValue: T;
  value: T;
  error: string;
  isDirty: boolean;
}

class FormValue<T = string> {
  private readonly validation: FormValueValodationProps<T>;

  private readonly originValue: T;

  private prevValue: T;

  private currentValue: T;

  error: string = '';

  constructor(value: T, validation?: FormValueValodationProps<T>) {
    this.validation = Object.freeze(validation || {});
    this.originValue = Object.freeze(value);
    this.prevValue = value;
    this.currentValue = value;
    if (this.validation.initValidation) {
      this._handleValidation(value);
    }
  }
  /**
   * @name Computed
   */
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
    if (this.validation.onValidation) {
      this.error = this.validation.onValidation(newValue, this.toValue());
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

  setValue(newValue: T) {
    this.prevValue = this.currentValue;
    this.currentValue = newValue;
    this._handleValidation(newValue);
    return this;
  }

  value() {
    return this.currentValue;
  }

  toValue(): FormValueToValueResponse<T> {
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
