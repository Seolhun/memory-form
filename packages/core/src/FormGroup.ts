import { MemoryQueue } from './queue';
import { FormValue, FormValueToValueResponse } from './FormValue';

/**
 * @name FormGroupValueProps<T>
 */
export type FormGroupValueProps<T> = {
  [key in keyof T]: T[keyof T];
};

/**
 * @name FormGroupValidationProps<T>
 */
export type FormGroupValidationProps<T> = {
  [key in keyof T]?: {
    /**
     * @default "() => ''"
     * @description This props is to change the value validation
     */
    onValidation?: (value: T[keyof T], toValues?: FormGroupToValueResponse<T>) => string;

    /**
     * @default false
     * @description This props is to check the init value validation.
     */
    initValidation?: boolean;
  };
};

/**
 * @name FormGroupOptionProps
 */
export interface FormGroupOptionProps {
  /**
   * @default change
   * @description This props is to check validation type.
   */
  validationType?: 'change' | 'submit';

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

/**
 * @name FormGroupFormType<T>
 */
export type FormGroupFormType<T> = {
  [key in keyof T]: FormValue<T[keyof T]>;
};

/**
 * @name FormGroupToValueResponse<T>
 */
export type FormGroupToValueResponse<T> = {
  [key in keyof T]: FormValueToValueResponse<T[keyof T]>;
};

const DEFAULT_PROPS: Required<FormGroupOptionProps> = {
  validationType: 'change',
  snapshotSize: 20,
  snapshotTimeout: 1000,
  validationTimeout: 500,
};

class FormGroup<T> {
  readonly validations: FormGroupValidationProps<T>;

  options: Required<FormGroupOptionProps>;

  private snapshots: MemoryQueue<Partial<FormGroupValueProps<T>>>;

  readonly form: FormGroupFormType<T>;

  constructor(
    values: FormGroupValueProps<T>,
    validations?: FormGroupValidationProps<T>,
    options?: FormGroupOptionProps,
  ) {
    this.validations = Object.freeze(validations || {});
    Object.assign(DEFAULT_PROPS, options);
    this.options = DEFAULT_PROPS;
    this.snapshots = new MemoryQueue([], this.options.snapshotSize);
    this.form = this._propsToForm(values);
  }

  /**
   * @name Computed
   */
  public get isDirty(): boolean {
    return Object.keys(this.form).some((key) => {
      return this.getFormGroupValueBy(key as keyof T).isDirty;
    });
  }

  public get hasError(): boolean {
    return Object.keys(this.form).some((key) => {
      return this.getFormGroupValueBy(key as keyof T).hasError;
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
  private _propsToForm = (values: FormGroupValueProps<T>): FormGroupFormType<T> => {
    const formValues = Object.keys(values).reduce<any>((acc, key) => {
      const typedKey = key as keyof T;
      const formGroupValue = values[typedKey];
      const formValueValidation = this.validations[typedKey];
      return {
        ...acc,
        [typedKey]: new FormValue(formGroupValue, {
          initValidation: formValueValidation?.initValidation,
          onValidation: (value: T[keyof T]) => {
            if (formValueValidation?.onValidation) {
              return formValueValidation.onValidation(value);
            }
            return '';
          },
        }),
      };
    }, {});
    return formValues;
  };

  private _handleGroupValues = (newValues: Partial<FormGroupValueProps<T>> = {}) => {
    Object.keys(this.form).forEach((key) => {
      const groupFormValue: FormValue<T[keyof T]> = this.form[key];
      if (newValues[key]) {
        const newValue: T[keyof T] = newValues[key];
        groupFormValue.setValue(newValue);
      }
    });
    return this;
  };

  private getFormGroupValueBy = (key: keyof T) => {
    return this.form[key];
  };

  undo = () => {
    const storedForm = this.snapshots.undo(this.value());
    if (storedForm) {
      this._handleGroupValues(storedForm);
    }
    return this;
  };

  redo = () => {
    const storedForm = this.snapshots.redo();
    if (storedForm) {
      this._handleGroupValues(storedForm);
    }
    return this;
  };

  setValue = (newValues: Partial<FormGroupValueProps<T>> = {}) => {
    // Set Prev Value
    this.snapshots.push(this.value());
    // Set New Value
    this._handleGroupValues(newValues);
    return this;
  };

  setOptions = (newOptions: Partial<FormGroupOptionProps> = {}) => {
    if (typeof newOptions.snapshotSize === 'number') {
      if (this.options.snapshotSize !== newOptions.snapshotSize) {
        this.snapshots = new MemoryQueue(this.snapshots.toArray(), newOptions.snapshotSize);
      }
    }
    Object.assign(this.options, newOptions);
  };

  value = (): FormGroupValueProps<T> => {
    const formValues = Object.keys(this.form).reduce((acc, key) => {
      const typedKey = key as keyof T;
      const formValue = this.getFormGroupValueBy(typedKey);
      return {
        ...acc,
        [typedKey]: formValue.value,
      };
    }, {} as FormGroupValueProps<T>);
    return formValues;
  };

  toValue = (): FormGroupToValueResponse<T> => {
    const formValues = Object.keys(this.form).reduce((acc, key) => {
      const typedKey = key as keyof T;
      const formValue = this.getFormGroupValueBy(typedKey);
      return {
        ...acc,
        [key]: formValue.toValue(),
      };
    }, {} as any);

    return formValues;
  };
}

export { FormGroup };
export default FormGroup;
