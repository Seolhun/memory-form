import React from 'react';
import { FormGroup, FormGroupOptionProps, FormGroupProps } from '@seolhun/momory-form-core';

interface UseFormGroupOption<T = any> extends FormGroupOptionProps {}

function useFormGroup<T = any>(value: FormGroupProps<T>, option?: UseFormGroupOption<T>) {
  const memoizedFormGroup = React.useMemo(() => {
    return new FormGroup<T>(value, option);
  }, [value, option]);

  return memoizedFormGroup;
}

export { useFormGroup };
export default useFormGroup;
