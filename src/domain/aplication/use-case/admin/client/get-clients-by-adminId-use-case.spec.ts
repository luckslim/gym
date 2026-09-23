import { NotFoundError } from "@/core/error/not-found-error";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../../test/factory/make-user";
import { MakePaymentHistory } from "../../../../../../test/factory/make-payment-history";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../../test/in-memory-repository/in-memory-client-repository";
import { InMemoryPaymentHistoryRepository } from "../../../../../../test/in-memory-repository/in-memory-payment-history-repository";
import { GetClientUseCase } from "./get-clients-by-adminId-use-case";

describe("Get clients by admin id", () => {
  it("deve separar clientes pagos e não pagos no período", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const paymentHistoryRepository = new InMemoryPaymentHistoryRepository();
    const clientRepository = new InMemoryClientRepository();
    const admin = MakeAdmin({ gymId: "gym-01" });
    const paidClient = MakeClient({ gymId: "gym-01", name: "Pago" });
    const unpaidClient = MakeClient({ gymId: "gym-01", name: "Pendente" });
    const paidOutsidePeriod = MakeClient({
      gymId: "gym-01",
      name: "Fora do periodo",
    });
    const clientFromAnotherGym = MakeClient({
      gymId: "gym-02",
      name: "Outra academia",
    });
    await adminRepository.create(admin);
    await clientRepository.create(paidClient);
    await clientRepository.create(unpaidClient);
    await clientRepository.create(paidOutsidePeriod);
    await clientRepository.create(clientFromAnotherGym);
    await paymentHistoryRepository.create(
      MakePaymentHistory({
        adminId: admin.id.toString(),
        userId: paidClient.id.toString(),
        date: new Date("2026-01-15T12:00:00.000Z"),
      }),
    );
    await paymentHistoryRepository.create(
      MakePaymentHistory({
        adminId: admin.id.toString(),
        userId: paidOutsidePeriod.id.toString(),
        date: new Date("2025-12-15T12:00:00.000Z"),
      }),
    );
    await paymentHistoryRepository.create(
      MakePaymentHistory({
        adminId: "outro-admin",
        userId: clientFromAnotherGym.id.toString(),
        date: new Date("2026-01-15T12:00:00.000Z"),
      }),
    );
    const saveSpy = vi.spyOn(clientRepository, "save");
    const result = await new GetClientUseCase(
      adminRepository,
      paymentHistoryRepository,
      clientRepository,
    ).execute({
      Id: admin.id.toString(),
      dateInitial: new Date("2026-01-01"),
      dateFinal: new Date("2026-01-31T23:59:59.999Z"),
    });
    expect(result.isRight()).toBe(true);
    if (result.isLeft()) throw result.value;
    expect(result.value.clientPayedStatus).toEqual([paidClient]);
    expect(result.value.clientNotPayedStatus).toEqual([
      unpaidClient,
      paidOutsidePeriod,
      clientFromAnotherGym,
    ]);
    expect(paidClient.status).toBe("paid");
    expect(unpaidClient.status).toBe("not-paid");
    expect(paidOutsidePeriod.status).toBe("not-paid");
    expect(clientFromAnotherGym.status).toBe("not-paid");
    expect(saveSpy).not.toHaveBeenCalled();
    expect(paymentHistoryRepository.items).toHaveLength(3);
  });

  it("deve retornar erro quando o admin não existe", async () => {
    const result = await new GetClientUseCase(
      new InMemoryAdminRepository(),
      new InMemoryPaymentHistoryRepository(),
      new InMemoryClientRepository(),
    ).execute({
      Id: "admin-inexistente",
      dateInitial: new Date("2026-01-01"),
      dateFinal: new Date("2026-01-31"),
    });
    expect(result.value).toEqual(new NotFoundError("Admin not found"));
  });
});
