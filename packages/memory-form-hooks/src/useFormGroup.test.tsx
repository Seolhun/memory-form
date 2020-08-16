import { renderHook, act } from '@testing-library/react-hooks';

import { useFormGroup } from './useFormGroup';

interface User {
  name: string;
  age: number;
}

describe('useFormGroup', () => {
  test('init', () => {
    let user = {
      name: 'seol',
      age: 20,
    };
    const { result } = renderHook(() =>
      useFormGroup<User>({
        name: {
          value: user.name,
        },
        age: {
          value: user.age,
        },
      }),
    );
    expect(result.current.value().age).toBe(user.age);
    expect(result.current.value().name).toBe(user.name);
    expect(result.current.value()).toStrictEqual(user);
    act(() => {
      Object.assign(user, {
        age: 25,
      });
      result.current.setValue(user);
    });
    expect(result.current.form.age.value()).toBe(user.age);
    expect(result.current.form.name.value()).toBe(user.name);
  });

  test('with Options', () => {
    let user = {
      name: 'seol',
      age: 20,
    };
    const errorMessage = 'Has Changed';
    const { result } = renderHook(() =>
      useFormGroup<User>({
        name: {
          value: user.name,
        },
        age: {
          value: user.age,
          onValidation: (newValue) => {
            if (newValue !== 20) {
              return errorMessage;
            }
            return '';
          },
        },
      }),
    );
    expect(result.current.value()).toStrictEqual(user);
    act(() => {
      Object.assign(user, {
        age: 25,
      });
      result.current.setValue(user);
    });
    expect(result.current.form.age.value()).toBe(user.age);
    expect(result.current.form.age.error).toBe(errorMessage);
    expect(result.current.isDirty).toBe(true);
    expect(result.current.hasError).toBe(true);
  });
});
