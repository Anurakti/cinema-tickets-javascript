import AccountIdValidator from "../../../src/pairtest/validation/AccountIdValidator.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest.js";
import ValidationDto from "../../../src/pairtest/validation/ValidationDto.js";
import ValidationException from "../../../src/pairtest/lib/ValidationException.js";
import Validator from "../../../src/pairtest/validation/Validator.js";

describe("AccountIdValidator", () => {
  let accountIdValidator;

  beforeEach(() => {
    accountIdValidator = new AccountIdValidator(null);
  });

  it("validates successfully", () => {
    const accountId = 20;
    const ticketTypeRequest = new TicketTypeRequest("ADULT", 2);
    const ticketTypeRequests = [ticketTypeRequest];
    const validationDto = new ValidationDto(ticketTypeRequests, accountId);
    const validatorSpy = jest.spyOn(Validator.prototype, 'validate');

    accountIdValidator.validate(validationDto);
    
    expect(validatorSpy).toHaveBeenCalledTimes(1);

    validatorSpy.mockRestore();
  });

  it("throws ValidationException", () => {
    const accountId = 0;
    const ticketTypeRequest = new TicketTypeRequest("ADULT", 2);
    const ticketTypeRequests = [ticketTypeRequest];
    const validationDto = new ValidationDto(ticketTypeRequests, accountId);
    const validatorSpy = jest.spyOn(Validator.prototype, 'validate');

    expect(() => {
      accountIdValidator.validate(validationDto);
    }).toThrow(ValidationException);
    expect(validatorSpy).toHaveBeenCalledTimes(1);

    validatorSpy.mockRestore();
  });
});
