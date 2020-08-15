import { FormGroup } from './FormGroup';

interface User {
  name: string;
  age: number;
}

describe('FormGroup Test', () => {
  test('constructor only value', () => {
    const originValue = {
      name: 'seol',
      age: 30,
    };
    const formGroup = new FormGroup<User>(originValue);
    expect(formGroup.value.age).toBe(originValue.age);
    expect(formGroup.value.name).toBe(originValue.name);
    expect(formGroup.options.initValidation).toBe(false);
    expect(formGroup.options.validationType).toBe('change');
    expect(formGroup.options.snapshotSize).toBe(20);
    expect(formGroup.options.snapshotTimeout).toBe(1000);
    expect(formGroup.options.validationTimeout).toBe(500);
    expect(formGroup.isDirty).toBe(false);
  });

  test('constructor value with options', () => {
    const originValue = {
      name: 'seol',
      age: 20,
    };
    const nextValue = {
      name: 'hun',
      age: 30,
    };
    let closuredValue = {};
    const onChange = jest.fn((newValue) => {
      Object.assign(closuredValue, newValue);
    });
    const onValidation = jest.fn((newValue) => {
      if (newValue.age !== originValue.age) {
        return 'Has Changed';
      }
      return '';
    });
    const formGroup = new FormGroup(originValue, {
      onChange,
      onValidation,
    });
    expect(formGroup.value.age).toBe(originValue.age);
    expect(formGroup.value.name).toBe(originValue.name);
    expect(formGroup.isDirty).toBe(false);
    expect(formGroup.hasError).toBe(false);
    formGroup.value = nextValue;
    expect(formGroup.value.age).toBe(nextValue.age);
    expect(formGroup.value.name).toBe(nextValue.name);
    expect(closuredValue).toStrictEqual(nextValue);
    expect(formGroup.isDirty).toBe(true);
    expect(formGroup.hasError).toBe(true);
  });
});
