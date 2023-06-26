import TicketService from "../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";
import ValidationException from "../../src/pairtest/lib/ValidationException.js";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";
import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService.js";
import Validator from "../../src/pairtest/validation/Validator.js";

jest.mock("../../src/thirdparty/paymentgateway/TicketPaymentService");
jest.mock("../../src/thirdparty/seatbooking/SeatReservationService");
jest.mock("../../src/pairtest/validation/Validator");

describe("TicketService", () => {
  let ticketPaymentService;
  let seatReservationService;
  let validator;
  let ticketService;

  beforeEach(() => {
    ticketPaymentService = new TicketPaymentService();
    seatReservationService = new SeatReservationService();
    validator = new Validator();
    ticketService = new TicketService(
      ticketPaymentService,
      seatReservationService,
      validator
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("purchaseTickets", () => {
    it("Successfully purchase tickets", () => {
      const accountId = 27;
      const ticketTypeRequest1 = new TicketTypeRequest("ADULT", 2);
      const ticketTypeRequest2 = new TicketTypeRequest("CHILD", 1);
      const ticketTypeRequest3 = new TicketTypeRequest("INFANT", 1);
      const ticketTypeRequests = [
        ticketTypeRequest1,
        ticketTypeRequest2,
        ticketTypeRequest3,
      ];
      validator.validate.mockImplementation(() => {});
      ticketPaymentService.makePayment.mockImplementation(() => {});
      seatReservationService.reserveSeat.mockImplementation(() => {});

      ticketService.purchaseTickets(accountId, ...ticketTypeRequests);

      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(ticketPaymentService.makePayment).toHaveBeenCalledTimes(1);
      expect(seatReservationService.reserveSeat).toHaveBeenCalledTimes(1);
    });

    it("throws InvalidPurchaseException when AccountIdValidation fails", () => {
      const accountId = -1;
      const ticketTypeRequest1 = new TicketTypeRequest("ADULT", 2);
      const ticketTypeRequest2 = new TicketTypeRequest("CHILD", 1);
      const ticketTypeRequest3 = new TicketTypeRequest("INFANT", 1);
      const ticketTypeRequests = [
        ticketTypeRequest1,
        ticketTypeRequest2,
        ticketTypeRequest3,
      ];

      validator.validate.mockImplementation(() => {
        throw new ValidationException("Invalid account id");
      });

      expect(() => {
        ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
      }).toThrow(InvalidPurchaseException);
      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(ticketPaymentService.makePayment).toHaveBeenCalledTimes(0);
      expect(seatReservationService.reserveSeat).toHaveBeenCalledTimes(0);
    });

    it("throws InvalidPurchaseException when no ADULT ticket is purchased", () => {
      const accountId = -12;
      const ticketTypeRequest1 = new TicketTypeRequest("CHILD", 1);
      const ticketTypeRequest2 = new TicketTypeRequest("INFANT", 1);
      const ticketTypeRequests = [ticketTypeRequest1, ticketTypeRequest2];

      validator.validate.mockImplementation(() => {
        throw new ValidationException("Child and Infant tickets cannot be purchased without purchasing an Adult ticket.");
      });

      expect(() => {
        ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
      }).toThrow(InvalidPurchaseException);
      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(ticketPaymentService.makePayment).toHaveBeenCalledTimes(0);
      expect(seatReservationService.reserveSeat).toHaveBeenCalledTimes(0);
    });

    it("throws InvalidPurchaseException when TicketLimitValidation fails", () => {
      const accountId = 1;
      const ticketTypeRequest1 = new TicketTypeRequest("ADULT", 18);
      const ticketTypeRequest2 = new TicketTypeRequest("CHILD", 2);
      const ticketTypeRequest3 = new TicketTypeRequest("INFANT", 1);
      const ticketTypeRequests = [
        ticketTypeRequest1,
        ticketTypeRequest2,
        ticketTypeRequest3,
      ];

      validator.validate.mockImplementation(() => {
        throw new ValidationException("Only a maximum of 20 tickets can be purchased at a time.");
      });

      expect(() => {
        ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
      }).toThrow(InvalidPurchaseException);
      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(ticketPaymentService.makePayment).toHaveBeenCalledTimes(0);
      expect(seatReservationService.reserveSeat).toHaveBeenCalledTimes(0);
    });
  });
});
