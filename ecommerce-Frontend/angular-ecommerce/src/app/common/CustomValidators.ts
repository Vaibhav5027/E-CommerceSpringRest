import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static notOnlyWhiteSpace(fromControl: FormControl): ValidationErrors {
    if (fromControl.value != null && fromControl.value.trim().length === 0) {
      return { notOnlyWhiteSpace: true };
    } else {
      return { notOnlyWhiteSpace: false };
    }
  }
}
