import { NotFoundError } from "@/core/error/not-found-error";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../../test/factory/make-user";
import { MakePaymentHistory } from "../../../../../../test/factory/make-payment-history";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../../test/in-memory-repository/in-memory-client-repository";
import { GetClientUseCase } from "./get-clients-by-adminId-use-case";

let adminRepository: InMemoryAdminRepository;
let clientRepository: InMemoryClientRepository;
let sut: GetClientUseCase;

describe("Get clients by admin id", () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    sut = new GetClientUseCase(adminRepository, clientRepository);
  });

  it("deve retornar clientes pagos e não pagos com paginação", async () => {
    const admin = MakeAdmin({ gymId: "gym-01" });
    const paidClient = MakeClient({ gymId: "gym-01", name: "Pago" });
    const unpaidClient = MakeClient({ gymId: "gym-01", name: "Pendente" });
    const outsidePeriodClient = MakeClient({
      gymId: "gym-01",
      name: "Fora do periodo",
    });
    const anotherGymClient = MakeClient({
      gymId: "gym-02",
      name: "Outra academia",
    });

    await adminRepository.create(admin);
    await clientRepository.create(paidClient);
    await clientRepository.create(unpaidClient);
    await clientRepository.create(outsidePeriodClient);
    await clientRepository.create(anotherGymClient);
    clientRepository.paymentHistoryItems.push(
      MakePaymentHistory({
        adminId: admin.gymId,
        userId: paidClient.id.toString(),
        date: new Date("2026-01-15T12:00:00.000Z"),
      }),
      MakePaymentHistory({
        adminId: admin.gymId,
        userId: outsidePeriodClient.id.toString(),
        date: new Date("2025-12-15T12:00:00.000Z"),
      }),
    );

    const result = await sut.execute({
      Id: admin.id.toString(),
      page: 1,
      perPage: 10,
      dateInitial: new Date("2026-01-01"),
      dateFinal: new Date("2026-01-31T23:59:59.999Z"),
    });

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) throw result.value;

    expect(result.value).toHaveLength(3);
    expect(result.value).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: paidClient.id, status: "paid" }),
        expect.objectContaining({ id: unpaidClient.id, status: "not-paid" }),
        expect.objectContaining({
          id: outsidePeriodClient.id,
          status: "not-paid",
        }),
      ]),
    );
    expect(result.value).not.toContainEqual(
      expect.objectContaining({ id: anotherGymClient.id }),
    );
  });

  it("deve aplicar os filtros de pesquisa antes da paginação", async () => {
    const admin = MakeAdmin({ gymId: "gym-01" });
    const matchingClient = MakeClient({
      gymId: "gym-01",
      name: "Ana Silva",
      email: "ana@example.com",
      city: "Recife",
      cep: 50000000,
      cellphone: 81999999999,
      cpf: 12345678901,
    });
    await adminRepository.create(admin);
    await clientRepository.create(matchingClient);
    await clientRepository.create(
      MakeClient({
        gymId: "gym-01",
        name: "Bruno",
        email: "bruno@example.com",
      }),
    );

    const result = await sut.execute({
      Id: admin.id.toString(),
      page: 1,
      perPage: 1,
      name: "Ana",
      email: "ana@",
      city: "Recife",
      cep: 50000000,
      cellphone: 81999999999,
      cpf: 12345678901,
      dateInitial: new Date("2026-01-01"),
      dateFinal: new Date("2026-01-31T23:59:59.999Z"),
    });

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) throw result.value;
    expect(result.value).toHaveLength(1);
    expect(result.value[0]).toMatchObject({
      id: matchingClient.id,
      name: "Ana Silva",
      status: "not-paid",
    });
  });

  it("deve filtrar somente clientes pagos quando status for paid", async () => {
    const admin = MakeAdmin({ gymId: "gym-01" });
    const paidClient = MakeClient({ gymId: "gym-01" });
    await adminRepository.create(admin);
    await clientRepository.create(paidClient);
    clientRepository.paymentHistoryItems.push(
      MakePaymentHistory({
        adminId: admin.gymId,
        userId: paidClient.id.toString(),
        date: new Date("2026-01-10"),
      }),
    );

    const result = await sut.execute({
      Id: admin.id.toString(),
      status: "paid",
      dateInitial: new Date("2026-01-01"),
      dateFinal: new Date("2026-01-31T23:59:59.999Z"),
    });

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) throw result.value;
    expect(result.value).toHaveLength(1);
    expect(result.value[0]?.status).toBe("paid");
  });

  it("deve retornar erro quando o admin não existe", async () => {
    const result = await sut.execute({
      Id: "admin-inexistente",
      dateInitial: new Date("2026-01-01"),
      dateFinal: new Date("2026-01-31"),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new NotFoundError("Admin not found"));
  });
});
