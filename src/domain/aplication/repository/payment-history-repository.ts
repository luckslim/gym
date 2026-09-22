import type { PaymentHistory } from "@/domain/enterprise/payment-history-entity";

export interface paymentHistoryRepository {
  create(paymenthistory: PaymentHistory): Promise<PaymentHistory>;
  findById(Id: string): Promise<PaymentHistory>;
  findClientsByGymIdAndDate(
    gymId: string,
    dateInitial: Date,
    dateFinal: Date,
  ): Promise<PaymentHistory[] | null>;
  save(paymenthistory: PaymentHistory): Promise<PaymentHistory>;
  delete(id: string): Promise<void>;
}
