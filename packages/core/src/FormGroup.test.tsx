import { FormGroup } from './FormGroup';

interface User {
  name: string;
  age: number;
}

describe('FormGroup Test', () => {
  test('constructor only value', () => {
    const originValue = {
      name: {
        value: 'seol',
      },
      age: {
        value: 20,
      },
    };
    const formGroup = new FormGroup<User>(originValue);
    expect(formGroup.form.age.toValue().value).toBe(originValue.age.value);
    expect(formGroup.form.name.toValue().value).toBe(originValue.name.value);
    expect(formGroup.options.initValidation).toBe(false);
    expect(formGroup.options.validationType).toBe('change');
    expect(formGroup.options.snapshotSize).toBe(20);
    expect(formGroup.options.snapshotTimeout).toBe(1000);
    expect(formGroup.options.validationTimeout).toBe(500);
    expect(formGroup.isDirty).toBe(false);
  });

  test('constructor value with options', () => {
    const errorMessage = 'Had Changed';
    const originValue = {
      name: {
        value: 'seol',
      },
      age: {
        value: 20,
        onValidation: jest.fn((newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        }),
      },
    };
    const nextValue = {
      age: {
        value: 25,
      },
      name: {
        value: 'hun',
      },
    };
    const formGroup = new FormGroup(originValue);
    expect(formGroup.form.age.toValue().value).toBe(originValue.age.value);
    expect(formGroup.form.name.toValue().value).toBe(originValue.name.value);
    expect(formGroup.isDirty).toBe(false);
    expect(formGroup.hasError).toBe(false);
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.toValue().value).toBe(nextValue.age.value);
    expect(formGroup.form.name.toValue().value).toBe(nextValue.name.value);
    expect(formGroup.isDirty).toBe(true);
    expect(formGroup.hasError).toBe(true);
  });

  test('gorup form', () => {
    const errorMessage = 'Had Changed';
    const originValue = {
      name: {
        value: 'seol',
      },
      age: {
        value: 20,
        onValidation: jest.fn((newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        }),
      },
    };

    const formGroup = new FormGroup(originValue);
    expect(formGroup.form.age.toValue().value).toBe(originValue.age.value);
    expect(formGroup.form.name.toValue().value).toBe(originValue.name.value);
    const nextValue = {
      name: {
        ...originValue.name,
        value: 'hun',
      },
      age: {
        ...originValue.age,
        value: 25,
      },
    };
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.originValue).toBe(originValue.age.value);
    expect(formGroup.form.age.toValue().value).toBe(nextValue.age.value);
    expect(formGroup.form.name.originValue).toBe(originValue.name.value);
    expect(formGroup.form.name.toValue().value).toBe(nextValue.name.value);

    const lastValue = {
      name: {
        ...nextValue.name,
        value: 'seolhun',
      },
      age: {
        ...nextValue.age,
        value: 30,
      },
    };
    formGroup.setValue(lastValue);
    expect(formGroup.form.age.originValue).toBe(originValue.age.value);
    expect(formGroup.form.age.toValue().value).toBe(lastValue.age.value);
    expect(formGroup.form.name.originValue).toBe(originValue.name.value);
    expect(formGroup.form.name.toValue().value).toBe(lastValue.name.value);
  });

  test('redo - undo', () => {
    const errorMessage = 'Had Changed';
    const originValue = {
      name: {
        value: 'seol',
      },
      age: {
        value: 20,
        onValidation: jest.fn((newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        }),
      },
    };
    const formGroup = new FormGroup(originValue);
    expect(formGroup.form.age.toValue().value).toBe(originValue.age.value);
    expect(formGroup.form.name.toValue().value).toBe(originValue.name.value);
    const nextValue = {
      name: {
        ...originValue.name,
        value: 'hun',
      },
      age: {
        ...originValue.age,
        value: 25,
      },
    };
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.originValue).toBe(originValue.age.value);
    expect(formGroup.form.age.toValue().value).toBe(nextValue.age.value);
    expect(formGroup.form.name.originValue).toBe(originValue.name.value);
    expect(formGroup.form.name.toValue().value).toBe(nextValue.name.value);
    expect(formGroup.form.name.error).toBe('');
    expect(formGroup.form.age.error).toBe(errorMessage);

    const lastValue = {
      name: {
        ...originValue.name,
        value: 'seolhun',
      },
      age: {
        ...originValue.age,
        value: 30,
      },
    };
    formGroup.setValue(lastValue);
    expect(formGroup.form.age.originValue).toBe(originValue.age.value);
    expect(formGroup.form.age.toValue().value).toBe(lastValue.age.value);
    expect(formGroup.form.name.originValue).toBe(originValue.name.value);
    expect(formGroup.form.name.toValue().value).toBe(lastValue.name.value);

    formGroup.undo();
    expect(formGroup.form.age.originValue).toBe(originValue.age.value);
    expect(formGroup.form.age.toValue().value).toBe(nextValue.age.value);
    expect(formGroup.form.name.originValue).toBe(originValue.name.value);
    expect(formGroup.form.name.toValue().value).toBe(nextValue.name.value);

    formGroup.redo();
    expect(formGroup.form.age.originValue).toBe(originValue.age.value);
    expect(formGroup.form.age.toValue().value).toBe(lastValue.age.value);
    expect(formGroup.form.name.originValue).toBe(originValue.name.value);
    expect(formGroup.form.name.toValue().value).toBe(lastValue.name.value);
  });
});
