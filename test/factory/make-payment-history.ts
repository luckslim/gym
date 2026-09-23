import type { UniqueEntityID } from "@/core/entity/unique-entityId";
import {
  PaymentHistory,
  type PaymentHistoryProps,
} from "@/domain/enterprise/payment-history-entity";
import { faker } from "@faker-js/faker";

export function MakePaymentHistory(
  override: Partial<PaymentHistoryProps>,
  id?: UniqueEntityID,
) {
  return PaymentHistory.create(
    {
      date: faker.date.recent(),
      userId: faker.string.uuid(),
      adminId: faker.string.uuid(),
      price: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
      methods: faker.helpers.arrayElement(["credit-card", "debit-card", "pix"]),
      ...override,
    },
    id,
  );
}
