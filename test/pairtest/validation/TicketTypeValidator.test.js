import TicketTypeValidator from "../../../src/pairtest/validation/TicketTypeValidator.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest.js";
import ValidationDto from "../../../src/pairtest/validation/ValidationDto.js";
import ValidationException from "../../../src/pairtest/lib/ValidationException.js";
import Validator from "../../../src/pairtest/validation/Validator.js";

describe("TicketTypeValidator", () => {
  let ticketTypeValidator;

  beforeEach(() => {
    ticketTypeValidator = new TicketTypeValidator(null);
  });

  it("returns true when at least one ticket type is ADULT", () => {
    const ticketTypeRequests = [
      new TicketTypeRequest("ADULT", 2),
      new TicketTypeRequest("INFANT", 1),
    ];
    const validationDto = new ValidationDto(ticketTypeRequests, 100);
    const validatorSpy = jest.spyOn(Validator.prototype, 'validate');

    ticketTypeValidator.validate(validationDto);

    expect(validatorSpy).toHaveBeenCalledTimes(1);

    validatorSpy.mockRestore();
  });

  it("throws a ValidationException when no ticket type is ADULT", () => {
    const ticketTypeRequests = [
      new TicketTypeRequest("CHILD", 2),
      new TicketTypeRequest("INFANT", 1),
    ];
    const validationDto = new ValidationDto(ticketTypeRequests, 100);
    const validatorSpy = jest.spyOn(Validator.prototype, 'validate');

    expect(() => {
      ticketTypeValidator.validate(validationDto);
    }).toThrow(ValidationException);
    expect(validatorSpy).toHaveBeenCalledTimes(1);

    validatorSpy.mockRestore();
  });
});
