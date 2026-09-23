import { NotAllowedError } from "@/core/error/not-allowed-error";
import { NotFoundError } from "@/core/error/not-found-error";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakePaymentHistory } from "../../../../../../test/factory/make-payment-history";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryPaymentHistoryRepository } from "../../../../../../test/in-memory-repository/in-memory-payment-history-repository";
import { DeletePaymentHistoryUseCase } from "./delete-payment-history-use-case";

describe("Delete payment history", () => {
  it("deve excluir um pagamento pertencente ao admin", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const paymentHistoryRepository = new InMemoryPaymentHistoryRepository();
    const admin = MakeAdmin({ gymId: "gym-01" });
    const payment = MakePaymentHistory({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await paymentHistoryRepository.create(payment);
    const sut = new DeletePaymentHistoryUseCase(
      paymentHistoryRepository,
      adminRepository,
    );

    const result = await sut.execute({
      Id: admin.id.toString(),
      payId: payment.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ message: "PaymentHistory Deleted" });
    expect(paymentHistoryRepository.items).toHaveLength(0);
  });

  it("deve rejeitar pagamento de outro admin", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const paymentHistoryRepository = new InMemoryPaymentHistoryRepository();
    const admin = MakeAdmin({ gymId: "gym-01" });
    const otherAdmin = MakeAdmin({ gymId: "gym-02" });
    const payment = MakePaymentHistory({ adminId: otherAdmin.id.toString() });
    await adminRepository.create(admin);
    await paymentHistoryRepository.create(payment);
    const sut = new DeletePaymentHistoryUseCase(
      paymentHistoryRepository,
      adminRepository,
    );

    const result = await sut.execute({
      Id: admin.id.toString(),
      payId: payment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      new NotAllowedError("Id from pay and admin not allowed"),
    );
    expect(paymentHistoryRepository.items).toHaveLength(1);
  });

  it("deve retornar erro quando admin ou pagamento não existem", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const paymentHistoryRepository = new InMemoryPaymentHistoryRepository();
    const sut = new DeletePaymentHistoryUseCase(
      paymentHistoryRepository,
      adminRepository,
    );

    const missingAdmin = await sut.execute({
      Id: "admin-inexistente",
      payId: "pay-01",
    });
    expect(missingAdmin.value).toEqual(
      new NotFoundError("Id from admin not found!"),
    );

    const admin = MakeAdmin({ gymId: "gym-01" });
    await adminRepository.create(admin);
    const missingPayment = await sut.execute({
      Id: admin.id.toString(),
      payId: "pay-inexistente",
    });
    expect(missingPayment.value).toEqual(
      new NotFoundError("Id from pay not found!"),
    );
  });
});
