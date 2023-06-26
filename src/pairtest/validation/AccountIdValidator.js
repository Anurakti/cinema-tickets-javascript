import ValidationException from "../lib/ValidationException.js";
import Validator from "./Validator.js";

export default class AccountIdValidator extends Validator {
  constructor(next) {
    super(next);
  }

  doValidate(validationDto) {
    if (validationDto.getAccountId() > 0) {
      return true;
    }

    throw new ValidationException("Invalid account id.");
  }
}