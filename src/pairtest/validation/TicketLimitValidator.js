import ValidationException from "../lib/ValidationException.js";
import { MAX_TICKETS_ALLOWED } from "../lib/TicketConstants.js";
import Validator from "./Validator.js";

export default class TicketLimitValidator extends Validator {
  constructor(next) {
    super(next);
  }

  doValidate(validationDto) {
    const count = validationDto
      .getTicketTypeRequests()
      .reduce((total, ticketTypeRequest) => {
        return total + ticketTypeRequest.getNoOfTickets();
      }, 0);

    if (count <= MAX_TICKETS_ALLOWED) {
      return true;
    }

    throw new ValidationException(
      "Only a maximum of 20 tickets can be purchased at a time."
    );
  }
}
