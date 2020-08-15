import { FormValue } from './FormValue';
import { Queue, MemoryQueue } from './queue';

export interface FormGroupOptionProps<T = any> {
  /**
   * @default "() => undefined"
   * @description This props is to change the value
   */
  onChange?: (newValues: Partial<T>) => void;

  /**
   * @default "() => ''"
   * @description This props is to change the value validation
   */
  onValidation?: (newValues: Partial<T>) => string;

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

export type ValidationType = 'change' | 'submit';

export type FormGroupValueProps<T> = {
  [key in keyof T]: T[keyof T];
};

export type FormGroupValue<T> = {
  key: keyof T;
  value: FormValue<T[keyof T]>;
};

const DEFAULT_PROPS: Required<FormGroupOptionProps<any>> = {
  onChange: (values: Partial<any>) => values,
  onValidation: (_values: Partial<any>) => '',
  initValidation: false,
  validationType: 'change',
  snapshotSize: 20,
  snapshotTimeout: 1000,
  validationTimeout: 500,
};

class FormGroup<T> {
  readonly options: FormGroupOptionProps<T>;

  private readonly snapshots: Queue<T>;

  private readonly group: FormGroupValue<T>[];

  constructor(value: FormGroupValueProps<T>, options?: FormGroupOptionProps<T>) {
    this.options = Object.freeze(options || (DEFAULT_PROPS as FormGroupOptionProps<T>));
    this.snapshots = new MemoryQueue<T>([], this.options.snapshotSize);
    this.group = this._rawToGroup(value);
  }

  /**
   * @name Computed
   */
  public set value(newValues: T) {
    this.snapshots.push(this.value);
    this._handleGroupValues(newValues)._handleGroupValidations(newValues);
  }

  public get value(): T {
    return this._formToRaw();
  }

  public get isDirty(): boolean {
    return this.group.some((groupForm) => {
      return groupForm.value.isDirty;
    });
  }

  public get hasError(): boolean {
    return this.group.some((groupForm) => {
      return groupForm.value.hasError;
    });
  }

  public get snapshotsSize(): number {
    return this.snapshots.size;
  }

  public get hasSnapshot(): boolean {
    return this.snapshots.isEmpty;
  }

  public get isFullSnapshots(): boolean {
    return this.snapshots.isLast;
  }

  /**
   * @name Methods
   */
  private _rawToGroup(values: FormGroupValueProps<T>): FormGroupValue<T>[] {
    const formValues = Object.keys(values).map<FormGroupValue<T>>((key: any) => {
      return {
        key,
        value: new FormValue(values[key], {
          initValidation: this.options.initValidation,
          onChange: (value) => {
            if (this.options.onChange) {
              this.options.onChange({
                [key]: value,
              });
            }
          },
          onValidation: (value) => {
            if (this.options.onValidation) {
              return this.options.onValidation({
                [key]: value,
              });
            }
            return '';
          },
        }),
      };
    });
    return formValues;
  }

  // TODO
  private _formToRaw(): T {
    const rawValues: any = {};
    this.group.forEach((groupForm) => {
      Object.assign(rawValues, {
        [groupForm.key]: groupForm.value.currentValue,
      });
    });
    return rawValues;
  }

  private _handleGroupValues(newValues: Partial<T>) {
    if (this.options.onChange) {
      this.options.onChange(newValues);
    }
    this.group.forEach((groupForm) => {
      const newValue: any = newValues[groupForm.key];
      if (newValue) {
        groupForm.value.value = newValue;
      }
    });
    return this;
  }

  private _handleGroupValidations(newValues: Partial<T>) {
    if (this.options.onValidation) {
      this.options.onValidation(newValues);
    }
    return this;
  }

  undo() {
    if (this.hasSnapshot) {
      const item = this.snapshots.shift();
      if (item) {
        this.value = item;
      }
    }
    return this;
  }

  redo() {
    if (this.hasSnapshot) {
      const item = this.snapshots.shift();
      if (item) {
        this.value = item;
      }
    }
    return this;
  }
}

export { FormGroup };
export default FormGroup;
