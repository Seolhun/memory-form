import { renderHook, act } from '@testing-library/react-hooks';

import { useFormValue } from './useFormValue';

describe('useFormValue', () => {
  test('init', () => {
    const { result } = renderHook(() => useFormValue(0));
    expect(result.current.value).toBe(0);
    act(() => {
      result.current.value = 10;
    });
    expect(result.current.value).toBe(10);
  });

  test('with Options', () => {
    let closuredValue = 0;
    const { result } = renderHook(() =>
      useFormValue<number>(0, {
        onChange: (value) => {
          closuredValue = value;
          return value;
        },
        onValidation: (value: number) => {
          if (value === 10) {
            return 'over 10';
          }
          return '';
        },
      }),
    );
    expect(result.current.value).toBe(0);
    act(() => {
      result.current.value = 10;
    });
    expect(result.current.value).toBe(10);
    expect(result.current.value).toBe(closuredValue);
    expect(result.current.isDirty).toBe(true);
    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe('over 10');
  });
});
