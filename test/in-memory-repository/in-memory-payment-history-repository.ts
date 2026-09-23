import type { paymentHistoryRepository } from "@/domain/aplication/repository/payment-history-repository";
import type { PaymentHistory } from "@/domain/enterprise/payment-history-entity";

export class InMemoryPaymentHistoryRepository implements paymentHistoryRepository {
  public items: PaymentHistory[] = [];

  async create(paymenthistory: PaymentHistory): Promise<PaymentHistory> {
    this.items.push(paymenthistory);
    return paymenthistory;
  }

  async findById(id: string): Promise<PaymentHistory | null> {
    return this.items.find((payment) => payment.id.toString() === id) ?? null;
  }

  async findClientsByGymIdAndDate(
    gymId: string,
    dateInitial: Date,
    dateFinal: Date,
  ): Promise<PaymentHistory[] | null> {
    return this.items.filter(
      (payment) =>
        payment.adminId === gymId &&
        payment.date >= dateInitial &&
        payment.date <= dateFinal,
    );
  }

  async save(paymenthistory: PaymentHistory): Promise<PaymentHistory> {
    const index = this.items.findIndex((item) => item.id === paymenthistory.id);
    if (index === -1) this.items.push(paymenthistory);
    else this.items[index] = paymenthistory;
    return paymenthistory;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((payment) => payment.id.toString() !== id);
  }
}
