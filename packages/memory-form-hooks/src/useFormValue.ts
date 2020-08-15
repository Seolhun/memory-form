import React from 'react';
import { FormValue, FormValueOptionProps } from '@seolhun/momory-form-core';

interface UseFormValueOption<T = any> extends FormValueOptionProps<T> {}

function useFormValue<T = any>(value: T, option?: UseFormValueOption<T>) {
  const memoizedFormValue = React.useMemo(() => {
    return new FormValue<T>(value, option);
  }, [value, option]);

  return memoizedFormValue;
}

export { useFormValue };
export default useFormValue;
