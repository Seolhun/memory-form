import { AbstractMemoryValue } from './AbstractMemoryValue';

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

  private _handleValidation(newValue: T) {
    if (this.options.onValidation) {
      this.error = this.options.onValidation(newValue);
    }
    return this;
  }
}

export { FormValue };
export default FormValue;
