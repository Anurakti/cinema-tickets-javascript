import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import ValidationDto from "./validation/ValidationDto.js";
import { ADULT_TICKET_COST } from "./lib/TicketConstants.js";
import { CHILD_TICKET_COST } from "./lib/TicketConstants.js"; 

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  constructor(ticketPaymentService, seatReservationService, validator) {
    this.ticketPaymentService = ticketPaymentService;
    this.seatReservationService = seatReservationService;
    this.validator = validator;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.validateRequests(accountId, ticketTypeRequests);

    let totalAmountToPay = 0;
    let totalSeatsToAllocate = 0;

    for (const ticketTypeRequest of ticketTypeRequests) {
      if (ticketTypeRequest.getTicketType() === "CHILD") {
        totalAmountToPay += CHILD_TICKET_COST * ticketTypeRequest.getNoOfTickets();
        totalSeatsToAllocate += ticketTypeRequest.getNoOfTickets();
      } else if (ticketTypeRequest.getTicketType() === "ADULT") {
        totalAmountToPay += ADULT_TICKET_COST * ticketTypeRequest.getNoOfTickets();
        totalSeatsToAllocate += ticketTypeRequest.getNoOfTickets();
      }
    }

    console.log(`Total Amount To Pay : ${totalAmountToPay}`);
    console.log(`Total Seats To Allocate : ${totalSeatsToAllocate}`);

    this.ticketPaymentService.makePayment(accountId, totalAmountToPay);
    this.seatReservationService.reserveSeat(accountId, totalSeatsToAllocate);
  }

  validateRequests(accountId, ticketTypeRequests) {
    try {
      const validationDto = new ValidationDto(ticketTypeRequests, accountId);
      this.validator.validate(validationDto);
    } catch (ex) {
      throw new InvalidPurchaseException(`Invalid Purchase Request - ${ex.message}`);
    }
  }
}
