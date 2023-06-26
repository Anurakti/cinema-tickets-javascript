export default class Validator {
  constructor(next) {
    this.next = next;
  }

  validate(validationDto) {
    if (!this.doValidate(validationDto)) {
      return;
    }

    if (this.next) {
      this.next.validate(validationDto);
    }
  }

  doValidate(validationDto) {}
}
