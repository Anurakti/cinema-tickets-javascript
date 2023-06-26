export default class ValidationDto {
    constructor(ticketTypeRequests, accountId) {
      this.ticketTypeRequests = ticketTypeRequests;
      this.accountId = accountId;
    }
  
    getTicketTypeRequests() {
      return this.ticketTypeRequests;
    }
  
    getAccountId() {
      return this.accountId;
    }
  }