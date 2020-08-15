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
    expect(formGroup.value.age).toBe(originValue.age);
    expect(formGroup.value.name).toBe(originValue.name);
    expect(formGroup.form.age.currentValue).toBe(originValue.age);
    expect(formGroup.form.name.currentValue).toBe(originValue.name);
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
      ...originValue,
      name: {
        ...originValue.name,
        value: 'hun',
      },
    };
    const formGroup = new FormGroup(originValue);
    expect(formGroup.value.age).toBe(originValue.age);
    expect(formGroup.value.name).toBe(originValue.name);
    expect(formGroup.isDirty).toBe(false);
    expect(formGroup.hasError).toBe(false);
    formGroup.value = nextValue;
    expect(formGroup.value.age).toBe(nextValue.age);
    expect(formGroup.value.name).toBe(nextValue.name);
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
    expect(formGroup.form.age.currentValue).toBe(originValue.age);
    expect(formGroup.form.name.currentValue).toBe(originValue.name);
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
    formGroup.value = nextValue;
    expect(formGroup.form.age.originValue).toBe(originValue.age);
    expect(formGroup.form.age.currentValue).toBe(nextValue.age);
    expect(formGroup.form.name.originValue).toBe(originValue.name);
    expect(formGroup.form.name.currentValue).toBe(nextValue.name);

    const lastValue = {
      name: 'seolhun',
      age: 30,
    };
    formGroup.value = lastValue;
    expect(formGroup.form.age.originValue).toBe(originValue.age);
    expect(formGroup.form.age.currentValue).toBe(lastValue.age);
    expect(formGroup.form.name.originValue).toBe(originValue.name);
    expect(formGroup.form.name.currentValue).toBe(lastValue.name);
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
    expect(formGroup.form.age.currentValue).toBe(originValue.age);
    expect(formGroup.form.name.currentValue).toBe(originValue.name);
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
    formGroup.value = nextValue;
    expect(formGroup.form.age.originValue).toBe(originValue.age);
    expect(formGroup.form.age.currentValue).toBe(nextValue.age);
    expect(formGroup.form.name.originValue).toBe(originValue.name);
    expect(formGroup.form.name.currentValue).toBe(nextValue.name);
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
    formGroup.value = lastValue;
    expect(formGroup.form.age.originValue).toBe(originValue.age);
    expect(formGroup.form.age.currentValue).toBe(lastValue.age);
    expect(formGroup.form.name.originValue).toBe(originValue.name);
    expect(formGroup.form.name.currentValue).toBe(lastValue.name);

    formGroup.undo();
    expect(formGroup.form.age.originValue).toBe(originValue.age);
    expect(formGroup.form.age.currentValue).toBe(nextValue.age);
    expect(formGroup.form.name.originValue).toBe(originValue.name);
    expect(formGroup.form.name.currentValue).toBe(nextValue.name);

    formGroup.redo();
    expect(formGroup.form.age.originValue).toBe(originValue.age);
    expect(formGroup.form.age.currentValue).toBe(lastValue.age);
    expect(formGroup.form.name.originValue).toBe(originValue.name);
    expect(formGroup.form.name.currentValue).toBe(lastValue.name);
  });
});
