import ValidationException from "../lib/ValidationException.js";
import Validator from "./Validator.js";

export default class TicketTypeValidator extends Validator {
  constructor(next) {
    super(next);
  }

  doValidate(validationDto) {
    const hasAdultTicket = validationDto.getTicketTypeRequests().some((ticketTypeRequest) => {
      return ticketTypeRequest.getTicketType() === "ADULT";
    });

    if (hasAdultTicket) {
      return true;
    }

    throw new ValidationException("Child and Infant tickets cannot be purchased without purchasing an Adult ticket.");
  }
}
