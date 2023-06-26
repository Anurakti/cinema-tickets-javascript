import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketService from "../pairtest/TicketService.js";
import TicketTypeRequest from "../pairtest/lib/TicketTypeRequest.js";
import AccountIdValidator from "../pairtest/validation/AccountIdValidator.js";
import TicketLimitValidator from "../pairtest/validation/TicketLimitValidator.js";
import TicketTypeValidator from "../pairtest/validation/TicketTypeValidator.js";

const ticketPaymentService = new TicketPaymentService();
const seatReservationService = new SeatReservationService();

const ticketLimitValidator = new TicketLimitValidator(null);
const ticketTypeValidator = new TicketTypeValidator(ticketLimitValidator);
const accountIdValidator = new AccountIdValidator(ticketTypeValidator);

const ticketService = new TicketService(
  ticketPaymentService,
  seatReservationService,
  accountIdValidator
);

const accountId = 1;
const ticketTypeRequest1 = new TicketTypeRequest("ADULT", 17);
const ticketTypeRequest2 = new TicketTypeRequest("CHILD", 3);
const ticketTypeRequest3 = new TicketTypeRequest("INFANT", 0);
const ticketTypeRequests = [
  ticketTypeRequest1,
  ticketTypeRequest2,
  ticketTypeRequest3,
];

ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
