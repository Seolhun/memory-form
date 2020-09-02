import FormGroup from './FormGroup';
import FormValue from './FormValue';

declare global {
  interface Window {
    MemoryForm: any;
  }
}

window.MemoryForm = window.MemoryForm || {};
function main() {
  window.MemoryForm.FormGroup = FormGroup;
  window.MemoryForm.FormValue = FormValue;
}
main();
