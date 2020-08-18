import React from 'react';
import equals from 'fast-deep-equal';
import {
  FormGroup,
  FormGroupValueProps,
  FormGroupOptionProps,
  FormGroupValidationProps,
} from '@seolhun/momory-form-core';

function useFormGroup<T = any>(
  value: FormGroupValueProps<T>,
  validations?: FormGroupValidationProps<T>,
  options?: FormGroupOptionProps,
) {
  const memoizedFormGroup = React.useMemo(() => {
    return new FormGroup<T>(value, validations, options);
  }, [value, validations]);

  React.useEffect(() => {
    if (!equals(memoizedFormGroup.options, options)) {
      memoizedFormGroup.setOptions(options);
    }
  }, [options]);

  return memoizedFormGroup;
}

export { useFormGroup };
export default useFormGroup;
