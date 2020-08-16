import { FormGroup } from './FormGroup';

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
    const formGroup = new FormGroup<User>({
      name: {
        value: originValue.name,
      },
      age: {
        value: originValue.age,
      },
    });
    expect(formGroup.form.age.toValue().value).toBe(originValue.age);
    expect(formGroup.form.name.toValue().value).toBe(originValue.name);
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
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup({
      name: {
        value: originValue.name,
      },
      age: {
        value: originValue.age,
        onValidation: jest.fn((newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        }),
      },
    });
    expect(formGroup.form.age.toValue().value).toBe(originValue.age);
    expect(formGroup.form.name.toValue().value).toBe(originValue.name);
    expect(formGroup.isDirty).toBe(false);
    expect(formGroup.hasError).toBe(false);
    const nextValue = {
      age: 25,
      name: 'hun',
    };
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.toValue().value).toBe(nextValue.age);
    expect(formGroup.form.name.toValue().value).toBe(nextValue.name);
    expect(formGroup.isDirty).toBe(true);
    expect(formGroup.hasError).toBe(true);
  });

  test('gorup form', () => {
    const errorMessage = 'Had Changed';
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup({
      name: {
        value: originValue.name,
      },
      age: {
        value: originValue.age,
        onValidation: jest.fn((newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        }),
      },
    });
    expect(formGroup.form.age.toValue().value).toBe(originValue.age);
    expect(formGroup.form.name.toValue().value).toBe(originValue.name);
    const nextValue = {
      name: 'hun',
      age: 25,
    };
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.toValue().value).toBe(nextValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.toValue().value).toBe(nextValue.name);
    const lastValue = {
      name: 'seolhun',
      age: 30,
    };
    formGroup.setValue(lastValue);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.toValue().value).toBe(lastValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.toValue().value).toBe(lastValue.name);
  });

  test('redo - undo', () => {
    const errorMessage = 'Had Changed';
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const formGroup = new FormGroup({
      name: {
        value: originValue.name,
      },
      age: {
        value: originValue.age,
        onValidation: jest.fn((newValue) => {
          if (newValue !== 20) {
            return errorMessage;
          }
          return '';
        }),
      },
    });
    expect(formGroup.form.age.toValue().value).toBe(originValue.age);
    expect(formGroup.form.name.toValue().value).toBe(originValue.name);
    const nextValue = {
      name: 'hun',
      age: 25,
    };
    formGroup.setValue(nextValue);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.toValue().value).toBe(nextValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.toValue().value).toBe(nextValue.name);
    expect(formGroup.form.name.error).toBe('');
    expect(formGroup.form.age.error).toBe(errorMessage);
    const lastValue = {
      name: 'seolhun',
      age: 30,
    };
    formGroup.setValue(lastValue);
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.toValue().value).toBe(lastValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.toValue().value).toBe(lastValue.name);

    formGroup.undo();
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.toValue().value).toBe(nextValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.toValue().value).toBe(nextValue.name);

    formGroup.redo();
    expect(formGroup.form.age.toValue().originValue).toBe(originValue.age);
    expect(formGroup.form.age.toValue().value).toBe(lastValue.age);
    expect(formGroup.form.name.toValue().originValue).toBe(originValue.name);
    expect(formGroup.form.name.toValue().value).toBe(lastValue.name);
  });
});
