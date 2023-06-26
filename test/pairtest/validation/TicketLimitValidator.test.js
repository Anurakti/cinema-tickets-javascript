import TicketLimitValidator from "../../../src/pairtest/validation/TicketLimitValidator.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest.js";
import ValidationDto from "../../../src/pairtest/validation/ValidationDto.js";
import ValidationException from "../../../src/pairtest/lib/ValidationException.js";
import Validator from "../../../src/pairtest/validation/Validator.js";

describe("TicketLimitValidator", () => {
  let ticketLimitValidator;

  beforeEach(() => {
    ticketLimitValidator = new TicketLimitValidator(null);
  });

  it("validates successfully", () => {
    const accountId = 20;
    const ticketTypeRequest = new TicketTypeRequest("ADULT", 2);
    const ticketTypeRequests = [ticketTypeRequest];
    const validationDto = new ValidationDto(ticketTypeRequests, accountId);
    const validatorSpy = jest.spyOn(Validator.prototype, 'validate');

    ticketLimitValidator.validate(validationDto);

    expect(validatorSpy).toHaveBeenCalledTimes(1);

    validatorSpy.mockRestore();
  });

  it("throws ValidationException", () => {
    const accountId = 20;
    const ticketTypeRequest = new TicketTypeRequest("ADULT", 21);
    const ticketTypeRequests = [ticketTypeRequest];
    const validationDto = new ValidationDto(ticketTypeRequests, accountId);
    const validatorSpy = jest.spyOn(Validator.prototype, 'validate');

    expect(() => {
      ticketLimitValidator.validate(validationDto);
    }).toThrow(ValidationException);
    expect(validatorSpy).toHaveBeenCalledTimes(1);

    validatorSpy.mockRestore();
  });
});
