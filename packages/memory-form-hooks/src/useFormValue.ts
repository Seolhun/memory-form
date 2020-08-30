import React from 'react';
import { FormValue, FormValueValodationProps } from '@seolhun/memory-form';

interface UseFormValueValidation<T = any> extends FormValueValodationProps<T> {}

function useFormValue<T = any>(value: T, option?: UseFormValueValidation<T>) {
  const memoizedFormValue = React.useMemo(() => {
    return new FormValue<T>(value, option);
  }, [value, option]);

  return memoizedFormValue;
}

export { useFormValue };
export default useFormValue;
