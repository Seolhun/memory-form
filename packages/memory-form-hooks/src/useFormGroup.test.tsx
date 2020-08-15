import { renderHook, act } from '@testing-library/react-hooks';

import { useFormGroup } from './useFormGroup';

interface User {
  name: string;
  age: number;
}

describe('useFormGroup', () => {
  test('init', () => {
    let user = {
      name: 'seolhun',
      age: 30,
    };
    const { result } = renderHook(() => useFormGroup<User>(user));
    expect(result.current.value.age).toBe(user.age);
    expect(result.current.value.name).toBe(user.name);
    expect(result.current.value).toStrictEqual(user);
    act(() => {
      user = {
        ...user,
        age: 35,
      };
      result.current.value = user;
    });
    expect(result.current.value.age).toBe(user.age);
    expect(result.current.value.name).toBe(user.name);
    expect(result.current.value).toStrictEqual(user);
  });

  test('with Options', () => {
    let user = {
      name: 'seolhun',
      age: 30,
    };
    let closuredValue = {};
    const errorMessage = 'Has Changed';
    const onChange = jest.fn((newValue) => {
      Object.assign(closuredValue, newValue);
    });
    const onValidation = jest.fn((newValue) => {
      if (newValue.age !== user.age) {
        return errorMessage;
      }
      return '';
    });
    const { result } = renderHook(() =>
      useFormGroup<User>(user, {
        onChange,
        onValidation,
      }),
    );
    expect(result.current.value).toStrictEqual(user);
    act(() => {
      user = {
        ...user,
        age: 35,
      };
      result.current.value = user;
    });
    const formResult = result.current.toForm;
    expect(result.current.value.age).toBe(user.age);
    expect(result.current.value).toStrictEqual(closuredValue);
    expect(result.current.isDirty).toBe(true);
    expect(result.current.hasError).toBe(true);
    console.log('@@', formResult);
    expect(formResult.age.error).toBe(errorMessage);
  });
});
