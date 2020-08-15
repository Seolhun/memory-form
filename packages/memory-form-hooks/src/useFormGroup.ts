import React from 'react';
import { FormGroup, FormGroupOptionProps } from '@seolhun/momory-form-core';

interface UseFormGroupOption<T = any> extends FormGroupOptionProps<T> {}

function useFormGroup<T = any>(value: T, option?: UseFormGroupOption<T>) {
  const memoizedFormGroup = React.useMemo(() => {
    return new FormGroup<T>(value, option);
  }, [value, option]);

  return memoizedFormGroup;
}

export { useFormGroup };
export default useFormGroup;
