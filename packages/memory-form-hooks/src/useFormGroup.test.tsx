import { renderHook, act } from '@testing-library/react-hooks';

import { useFormGroup } from './useFormGroup';
import { FormGroupValueType } from '@seolhun/momory-form-core';

interface User {
  name: FormGroupValueType<string>;
  age: FormGroupValueType<number>;
}

describe('useFormGroup', () => {
  test('init', () => {
    let user = {
      name: {
        value: 'seol',
      },
      age: {
        value: 20,
      },
    };
    const { result } = renderHook(() => useFormGroup<User>(user));
    expect(result.current.value.age).toBe(user.age);
    expect(result.current.value.name).toBe(user.name);
    expect(result.current.value).toStrictEqual(user);
    act(() => {
      user = {
        ...user,
        age: {
          value: 25,
        },
      };
      result.current.value = user;
    });
    expect(result.current.value.age).toBe(user.age);
    expect(result.current.value.name).toBe(user.name);
    expect(result.current.value).toStrictEqual(user);
  });

  test('with Options', () => {
    let user = {
      name: {
        value: 'seol',
      },
      age: {
        value: 20,
      },
    };
    const errorMessage = 'Has Changed';
    const onValidation = jest.fn((newValue) => {
      if (newValue.age !== user.age) {
        return errorMessage;
      }
      return '';
    });
    const { result } = renderHook(() =>
      useFormGroup<User>(user, {
        onValidation,
      }),
    );
    expect(result.current.value).toStrictEqual(user);
    act(() => {
      user = {
        ...user,
        age: {
          value: 25,
        },
      };
      result.current.value = user;
    });
    expect(result.current.value.age).toBe(user.age);
    expect(result.current.isDirty).toBe(true);
    expect(result.current.hasError).toBe(true);
    expect(result.current.form.age.error).toBe(errorMessage);
  });
});
