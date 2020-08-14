import FormValue from './FormValue';
import AbstractMemoryValue from './AbstractMemoryValue';

export interface FormGroupOptionProps<T = any> {
  /**
   * @default "() => undefined"
   * @description This props is to change the value
   */
  onChange?: (newValues: Partial<T>) => void;

  /**
   * @default false
   * @description This props is to check the init value validation.
   */
  initValidation?: boolean;

  /**
   * @default chagne
   * @description This props is to check validation type.
   */
  validationType?: ValidationType;

  /**
   * @default false
   * @description This props is to check validation sequence type.
   */
  isSequence?: boolean;

  /**
   * @default true
   * @description This props is to move time traveling .
   */
  hasSnapshot?: boolean;

  /**
   * @default 20
   * @description This props is to store prev value by size.
   */
  snapshotSize?: number;

  /**
   * @default 1000
   * @description This props is to executed snapshot intervally at timeout.
   */
  snapshotTimeout?: number;

  /**
   * @default 500
   * @description This props is to executed validation intervally at timeout.
   */
  validationTimeout?: number;
}

export type ValidationType = 'chagne' | 'submit';

const DEFAULT_PROPS: Required<FormGroupOptionProps<any>> = {
  onChange: () => undefined,
  initValidation: false,
  validationType: 'chagne',
  isSequence: false,
  hasSnapshot: true,
  snapshotSize: 20,
  snapshotTimeout: 1000,
  validationTimeout: 500,
};

class FormGroup<T = {}> extends AbstractMemoryValue<T> {
  readonly options: FormGroupOptionProps<T>;

  error: string = '';

  readonly snapshots: T[] = [];

  constructor(value: T, options?: FormGroupOptionProps<T>) {
    super(value);
    this.options = Object.freeze(options || (DEFAULT_PROPS as FormGroupOptionProps<T>));
    const formValues = this._parseRawValueToFormValue(value);
    this._prevValue = formValues;
    this._value = formValues;
  }

  /**
   * @name Methods
   */
  private _parseRawValueToFormValue(value: T): T {
    const formValues = Object.keys(value).reduce<any>((acc, key) => {
      return {
        ...acc,
        [key]: new FormValue<T[keyof T]>(value[key], {
          initValidation: this.options.initValidation,
        }),
      };
    }, {});
    return formValues;
  }

  private _parseFormValueToRawValue(formValues: T): T {
    const rawValues = Object.keys(formValues).reduce<any>((acc, key) => {
      return {
        ...acc,
        [key]: formValues[key].value,
      };
    }, {});
    return rawValues;
  }

  private _handleSnapshots(newValues: T) {
    if (this.isFullSnapshots) {
      this.snapshots.shift();
    }
    this.snapshots.push(newValues);

    return this;
  }

  private _handleGroupValues(newValues: Partial<T>) {
    if (this.options.onChange) {
      this.options.onChange(newValues);
    }

    return this;
  }

  private _handleGroupValidations(newValue: T) {
    return this;
  }

  reset() {
    this.value = this._parseRawValueToFormValue(this._originValue);
    return this;
  }

  go(index: number) {
    return this;
  }

  undo() {
    const item = this.snapshots.shift();
    if (item) {
      this.value = item;
    }
  }

  redo() {}

  // toValues(): FormValueProps<T> {
  //   return
  // }

  /**
   * @name GetterSetter
   */
  public set value(newValues: T) {
    this._prevValue = this._value;
    this.value = newValues;
    this._handleSnapshots(this._value)
      ._handleGroupValues(newValues)
      ._handleGroupValidations(newValues);
  }

  public get value(): T {
    return this._parseFormValueToRawValue(this._value);
  }

  /**
   * @name Computed
   */
  public get isDirty(): boolean {
    return Object.keys(this._value).every((key) => {
      const formValue: FormValue<T[keyof T]> = this._value[key];
      return formValue.isDirty;
    });
  }

  public get hasError(): boolean {
    return Object.keys(this._value).every((key) => {
      const formValue: FormValue<T[keyof T]> = this._value[key];
      return formValue.error;
    });
  }

  public get snapshotsSize(): number {
    return this.snapshots.length;
  }

  public get hasSnapshot(): boolean {
    return this.snapshotsSize > 0;
  }

  public get isFullSnapshots(): boolean {
    return this.snapshotsSize >= this.snapshotsSize;
  }
}

export { FormGroup };
export default FormGroup;
