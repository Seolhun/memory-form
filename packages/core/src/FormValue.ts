import { AbstractMemoryValue } from './AbstractMemoryValue';

export interface FormValueOptionProps<T = string> {
  /**
   * @default "() => undefined"
   * @description This props is to change the value
   */
  onChange?: (newValue: T) => void;

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

class FormValue<T = string> extends AbstractMemoryValue<T> {
  readonly options: FormValueOptionProps<T>;

  error: string = '';

  constructor(value: T, options?: FormValueOptionProps<T>) {
    super(value);
    this.options = Object.freeze(options || {});
    if (this.options.initValidation) {
      this._handleValidation(value);
    }
  }

  /**
   * @name Computed
   */
  public set value(newValue: T) {
    this._prevValue = this._value;
    this._value = newValue;
    this._handleValue(newValue)._handleValidation(newValue);
  }

  public get value() {
    return this._value;
  }

  public get hasError(): boolean {
    return !!this.error;
  }

  public get toFormValue() {
    return {
      value: this.value,
      error: this.error,
      isDirty: this.isDirty,
    };
  }

  /**
   * @name Methods
   */
  private _handleValue(newValue: T) {
    if (this.options.onChange) {
      this.options.onChange(newValue);
    }
    return this;
  }

  private _handleValidation(newValue: T) {
    if (this.options.onValidation) {
      this.error = this.options.onValidation(newValue);
    }
    return this;
  }
}

export { FormValue };
export default FormValue;
