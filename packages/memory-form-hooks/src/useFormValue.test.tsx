import { renderHook, act } from '@testing-library/react-hooks';

import { useFormValue } from './useFormValue';

describe('useFormValue', () => {
  test('init', () => {
    const { result } = renderHook(() => useFormValue(0));
    expect(result.current.toValue().value).toBe(0);
    act(() => {
      result.current.setValue(10);
    });
    expect(result.current.value()).toBe(10);
  });

  test('with Options', () => {
    const errorMessage = 'Over 10';
    const { result } = renderHook(() =>
      useFormValue<number>(0, {
        onValidation: (value: number) => {
          if (value === 10) {
            return errorMessage;
          }
          return '';
        },
      }),
    );
    expect(result.current.value()).toBe(0);
    act(() => {
      result.current.setValue(10);
    });
    expect(result.current.value()).toBe(10);
    expect(result.current.isDirty).toBe(true);
    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe(errorMessage);
  });
});
