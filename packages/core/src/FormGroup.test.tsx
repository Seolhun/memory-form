import { FormGroup, FormGroupOptionProps } from './FormGroup';

interface User {
  name: string;
  age: number;
}

describe('FormGroup Test', () => {
  test('constructor only value', () => {
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup<User>(originValue);
    expect(formGroup.form.age.value).toBe(originValue.age);
    expect(formGroup.form.name.value).toBe(originValue.name);
    expect(formGroup.options.validationType).toBe('change');
    expect(formGroup.options.snapshotSize).toBe(20);
    expect(formGroup.options.snapshotTimeout).toBe(1000);
    expect(formGroup.options.validationTimeout).toBe(500);
    expect(formGroup.isDirty).toBe(false);
  });

  test('constructor value with options', () => {
    const errorMessage = 'Had Changed';
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup(originValue, {
      age: {
        onValidation: (newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        },
      },
    });
    expect(formGroup.form.age.value).toBe(originValue.age);
    expect(formGroup.form.name.value).toBe(originValue.name);
    expect(formGroup.isDirty).toBe(false);
    expect(formGroup.hasError).toBe(false);
    const nextValue = {
      age: 25,
      name: 'hun',
    };
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.value).toBe(nextValue.age);
    expect(formGroup.form.name.value).toBe(nextValue.name);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.isDirty).toBe(true);
    expect(formGroup.hasError).toBe(true);
  });

  test('gorup form', () => {
    const errorMessage = 'Had Changed';
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup(originValue, {
      age: {
        onValidation: (newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        },
      },
    });
    expect(formGroup.form.age.value).toBe(originValue.age);
    expect(formGroup.form.name.value).toBe(originValue.name);
    expect(formGroup.value()).toStrictEqual(originValue);
    const nextValue = {
      name: 'hun',
      age: 25,
    };
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.value).toBe(nextValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.value).toBe(nextValue.name);
    expect(formGroup.value()).toStrictEqual(nextValue);
    const lastValue = {
      name: 'seolhun',
      age: 30,
    };
    formGroup.setValue(lastValue);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.value).toBe(lastValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.value).toBe(lastValue.name);
    expect(formGroup.value()).toStrictEqual(lastValue);
  });

  test('redo - undo', () => {
    const errorMessage = 'Had Changed';
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup(originValue, {
      age: {
        onValidation: (newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        },
      },
    });
    expect(formGroup.form.age.value).toBe(originValue.age);
    expect(formGroup.form.name.value).toBe(originValue.name);
    expect(formGroup.hasSnapshot).toBe(false);

    const nextValue = {
      name: 'hun',
      age: 25,
    };
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.value).toBe(nextValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.value).toBe(nextValue.name);
    expect(formGroup.form.name.error).toBe('');
    expect(formGroup.form.age.error).toBe(errorMessage);
    expect(formGroup.snapshotsSize).toBe(1);
    expect(formGroup.hasSnapshot).toBe(true);

    const lastValue = {
      name: 'seolhun',
      age: 30,
    };
    formGroup.setValue(lastValue);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.value).toBe(lastValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.value).toBe(lastValue.name);
    expect(formGroup.snapshotsSize).toBe(2);

    formGroup.undo();
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.value).toBe(nextValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.value).toBe(nextValue.name);

    formGroup.undo();
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.value).toBe(originValue.age);

    formGroup.redo();
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.value).toBe(nextValue.age);

    formGroup.redo();
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.value).toBe(lastValue.age);
  });

  test('snapshots', () => {
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup(originValue);
    for (let i = 1; i <= formGroup.options.snapshotSize; i++) {
      formGroup.setValue({
        ...originValue,
        age: originValue.age + i,
      });
      expect(formGroup.snapshotsSize).toBe(i);
      if (i === 20) {
        expect(formGroup.isFullSnapshots).toBe(true);
      }
    }
  });

  test('setOptions', () => {
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup(originValue);
    expect(formGroup.options.validationType).toBe('change');
    expect(formGroup.options.snapshotSize).toBe(20);
    expect(formGroup.options.snapshotTimeout).toBe(1000);
    expect(formGroup.options.validationTimeout).toBe(500);

    for (let i = 1; i <= formGroup.options.snapshotSize; i++) {
      formGroup.setValue({
        ...originValue,
        age: originValue.age + i,
      });
      if (formGroup.snapshotsSize >= formGroup.options.snapshotSize) {
        expect(formGroup.isFullSnapshots).toBe(true);
      } else {
        expect(formGroup.snapshotsSize).toBe(i);
      }
    }
    expect(formGroup.snapshotsSize).toBe(20);

    const options: FormGroupOptionProps = {
      validationType: 'submit',
      snapshotSize: 40,
      snapshotTimeout: 500,
      validationTimeout: 1000,
    };
    formGroup.setOptions(options);
    expect(formGroup.options.validationType).toBe(options.validationType);
    expect(formGroup.options.snapshotTimeout).toBe(options.snapshotTimeout);
    expect(formGroup.options.validationTimeout).toBe(options.validationTimeout);
    expect(formGroup.options.snapshotSize).toBe(options.snapshotSize);

    for (let i = 1; i <= formGroup.options.snapshotSize; i++) {
      formGroup.setValue({
        ...originValue,
        age: originValue.age + i,
      });
      if (formGroup.snapshotsSize >= formGroup.options.snapshotSize) {
        expect(formGroup.isFullSnapshots).toBe(true);
      } else {
        expect(formGroup.snapshotsSize).toBe(20 + i);
        expect(formGroup.isFullSnapshots).toBe(false);
      }
    }
  });
});
