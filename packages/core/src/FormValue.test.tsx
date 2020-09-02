import { FormValue } from './FormValue';

describe('FormValue Test', () => {
  test('constructor only value', () => {
    const originValue: string = 'seolhun';
    const formValue = new FormValue(originValue);
    expect(formValue.value).toBe(originValue);
    expect(formValue.isDirty).toBe(false);
  });

  test('constructor value with options', () => {
    const originValue: string = 'seolhun';
    const nextValue = 'nextValue';
    const onValidation = jest.fn((newValue) => {
      if (newValue !== originValue) {
        return 'Has Changed';
      }
      return '';
    });
    const formValue = new FormValue(originValue, {
      onValidation,
    });
    expect(formValue.value).toBe(originValue);
    expect(formValue.isDirty).toBe(false);
    expect(formValue.hasError).toBe(false);
    formValue.setValue(nextValue);
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

  test('toValue', () => {
    const originValue: string = 'seolhun';
    const errorMessage = 'Value is changed';
    const onValidation = jest.fn((newValue, formValues) => {
      if (newValue !== formValues.originValue) {
        return errorMessage;
      }
      return '';
    });
    const formValue = new FormValue(originValue, {
      onValidation,
    });
    expect(formValue.toValue()).toStrictEqual({
      originValue: originValue,
      prevValue: originValue,
      value: originValue,
      error: '',
      isDirty: false,
    });
    const nextValue = 'shun';
    formValue.setValue(nextValue);
    expect(formValue.toValue()).toStrictEqual({
      originValue: originValue,
      prevValue: originValue,
      value: nextValue,
      error: errorMessage,
      isDirty: true,
    });
  });

  test('reset', () => {
    const originValue: string = 'seolhun';
    const nextValue = 'shun';
    const formValue = new FormValue(originValue);
    formValue.setValue(nextValue);
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
    formValue.setValue(nextValue);
    expect(formValue.value).toBe(nextValue);
    expect(formValue.isDirty).toBe(true);
    expect(formValue.isEqauls(nextValue)).toBe(true);
  });
});
