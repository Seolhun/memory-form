# memory-form

[![Build Status](https://travis-ci.com/Seolhun/memory-form.svg?branch=master)](https://travis-ci.com/Seolhun/memory-form)

## Goal

- Memorizing values
- Time travel changing value
- Multi support framework

## How to use


```bash
npm install @seolhun/memory-form
```

### Javascript
```js

```

### React
```ts
// FormValue
const formValue = useFormValue<number>(0, {
  onValidation: (value: number) => {
    if (value > 10) {
      return 'Over 10';
    }
    return '';
  },
});
formValue.value(); // 0
formValue.setValue(11)
formValue.hasError; // true
formValue.error; // 'Over 10';
formValue.toValue().hasError; // true
formValue.toValue().error; // 'Over 10';

// FormGroup
interface User {
  name: string;
  age: number;
}

let user = {
  name: 'seol',
  age: 20,
};

const formGroup = useFormGroup<User>({
  name: {
    value: user.name,
  },
  age: {
    value: user.age,
    onValidation: (newValue) => {
      if (newValue !== 20) {
        return 'Has Changed';
      }
      return '';
    },
  },
});
formGroup.form.name.value(); // 'seol'
formGroup.form.age.toValue().value; // 20
Object.assign(user, {
  age: 25,
});
formGroup.setValue(user)
formGroup.form.age.error; // 'Has Changed';
formGroup.toValue().age.error; // 'Has Changed';
```

## Scripts

#### Build

```bash
npm install
npm run bs
npm run build
```

#### Test

```bash
npm run test
```

```bash
npm run lint
