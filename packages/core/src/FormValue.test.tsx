import { FormValue } from './FormValue';

describe('FormValue Test', () => {
  test('constructor only value', () => {
    const originValue: string = 'seolhun';
    const formValue = new FormValue(originValue);
    expect(formValue.value).toBe(originValue);
    expect(formValue.options).toStrictEqual({});
    expect(formValue.isDirty).toBe(false);
  });

  test('constructor value with options', () => {
    const originValue: string = 'seolhun';
    const nextValue = 'nextValue';
    let closuredValue = '';
    const onChange = jest.fn((newValue) => {
      closuredValue = newValue;
    });
    const onValidation = jest.fn((newValue) => {
      if (newValue !== originValue) {
        return 'Has Changed';
      }
      return '';
    });
    const formValue = new FormValue(originValue, {
      onChange,
      onValidation,
    });
    expect(formValue.value).toBe(originValue);
    expect(formValue.options).toStrictEqual({
      onChange,
      onValidation,
    });
    expect(formValue.isDirty).toBe(false);
    expect(formValue.hasError).toBe(false);
    formValue.value = nextValue;
    expect(closuredValue).toBe(nextValue);
    expect(formValue.hasError).toBe(true);
    expect(formValue.error).toBe('Has Changed');
  });

  test('initValidation', () => {
    const originValue: string = '';
    const onValidation = jest.fn((newValue) => {
      if (!newValue) {
        return 'Value is Empty';
      }
      return '';
    });
    const formValue = new FormValue(originValue, {
      initValidation: true,
      onValidation,
    });
    expect(formValue.error).toBe('Value is Empty');
  });

  test('reset', () => {
    const originValue: string = 'seolhun';
    const nextValue = 'shun';
    const formValue = new FormValue(originValue);
    formValue.value = nextValue;
    expect(formValue.value).toBe(nextValue);
    expect(formValue.isDirty).toBe(true);
    formValue.reset();
    expect(formValue.value).toBe(originValue);
  });

  test('isEquals', () => {
    const originValue: string = 'seolhun';
    const nextValue = 'shun';
    const formValue = new FormValue(originValue);
    expect(formValue.isEqauls(nextValue)).toBe(false);
    formValue.value = nextValue;
    expect(formValue.value).toBe(nextValue);
    expect(formValue.isDirty).toBe(true);
    expect(formValue.isEqauls(nextValue)).toBe(true);
  });
});
