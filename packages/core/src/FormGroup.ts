import { MemoryQueue } from './queue';
import { FormValue } from './FormValue';

export type FormGroupProps<T> = {
  [key in keyof T]: FormGroupValueType<T>;
};

export type FormGroupValueType<T> = {
  /**
   * @description This props is to display the value
   */
  value: T[keyof T];

  /**
   * @default "() => ''"
   * @description This props is to change the value validation
   */
  onValidation?: (value: T[keyof T]) => string;
};

export type FormGroupFormType<T> = {
  [key in keyof T]: FormValue<T[keyof T]>;
};

export type ValidationType = 'change' | 'submit';

export interface FormGroupOptionProps {
  /**
   * @default false
   * @description This props is to check the init value validation.
   */
  initValidation?: boolean;

  /**
   * @default change
   * @description This props is to check validation type.
   */
  validationType?: ValidationType;

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

const DEFAULT_PROPS: FormGroupOptionProps = {
  initValidation: false,
  validationType: 'change',
  snapshotSize: 20,
  snapshotTimeout: 1000,
  validationTimeout: 500,
};

class FormGroup<T> {
  readonly options: FormGroupOptionProps;

  private readonly snapshots: MemoryQueue<T>;

  readonly form: FormGroupFormType<T>;

  constructor(values: FormGroupProps<T>, options?: FormGroupOptionProps) {
    this.options = Object.freeze(options || DEFAULT_PROPS);
    this.snapshots = new MemoryQueue<T>([], this.options.snapshotSize);
    this.form = this._propsToForm(values);
  }

  /**
   * @name Computed
   */
  public set value(newValues: T) {
    this.snapshots.push(this.value);
    this._handleGroupValues(newValues);
  }

  public get value(): T {
    return Object.keys(this.form).reduce((acc, key) => {
      return {
        ...acc,
        [key]: this.getGroupValue(key as keyof T).currentValue,
      };
    }, {} as any);
  }

  public get isDirty(): boolean {
    return Object.keys(this.form).some((key) => {
      return this.getGroupValue(key as keyof T).isDirty;
    });
  }

  public get hasError(): boolean {
    return Object.keys(this.form).some((key) => {
      return this.getGroupValue(key as keyof T).hasError;
    });
  }

  public get snapshotsSize(): number {
    return this.snapshots.size;
  }

  public get hasSnapshot(): boolean {
    return !this.snapshots.isEmpty;
  }

  public get isFullSnapshots(): boolean {
    return this.snapshots.isLast;
  }

  /**
   * @name Methods
   */
  private _propsToForm(values: FormGroupProps<T>): FormGroupFormType<T> {
    const formValues = Object.keys(values).reduce<any>((acc, key) => {
      const formGroupValue: FormGroupValueType<T> = values[key];
      return {
        ...acc,
        [key]: new FormValue(formGroupValue, {
          initValidation: this.options.initValidation,
          onValidation: (value: any) => {
            if (formGroupValue.onValidation) {
              return formGroupValue.onValidation(value);
            }
            return '';
          },
        }),
      };
    }, {});
    return formValues;
  }

  private _handleGroupValues(newValues: Partial<T>) {
    Object.keys(this.form).forEach((key) => {
      this.form[key].value = newValues[key];
    });
    return this;
  }

  private getGroupValue(key: keyof T) {
    return this.form[key];
  }

  undo() {
    const storedForm = this.snapshots.undo(this.value);
    if (storedForm) {
      this.value = storedForm;
    }
    return this;
  }

  redo() {
    const storedForm = this.snapshots.redo(this.value);
    if (storedForm) {
      this.value = storedForm;
    }
    return this;
  }
}

export { FormGroup };
export default FormGroup;
