import { NotAllowedError } from "@/core/error/not-allowed-error";
import { NotFoundError } from "@/core/error/not-found-error";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../../test/factory/make-user";
import { MakeGym } from "../../../../../../test/factory/make-gym";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../../test/in-memory-repository/in-memory-client-repository";
import { InMemoryGymRepository } from "../../../../../../test/in-memory-repository/in-memory-gym-repository";
import { InMemoryPaymentHistoryRepository } from "../../../../../../test/in-memory-repository/in-memory-payment-history-repository";
import { CreatePaymentHistoryUseCase } from "./create-payment-history-use-case";

let paymentHistoryRepository: InMemoryPaymentHistoryRepository;
let clientRepository: InMemoryClientRepository;
let adminRepository: InMemoryAdminRepository;
let gymRepository: InMemoryGymRepository;
let sut: CreatePaymentHistoryUseCase;

describe("Create payment history", () => {
  beforeEach(() => {
    paymentHistoryRepository = new InMemoryPaymentHistoryRepository();
    clientRepository = new InMemoryClientRepository();
    adminRepository = new InMemoryAdminRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CreatePaymentHistoryUseCase(
      paymentHistoryRepository,
      clientRepository,
      adminRepository,
      gymRepository,
    );
  });

  it("deve registrar o pagamento e liberar o cliente", async () => {
    const admin = MakeAdmin({ gymId: "gym-placeholder" });
    const gym = MakeGym({ adminId: admin.id.toString() });
    const client = MakeClient({
      gymId: gym.id.toString(),
      status: "pending for payment",
    });
    await adminRepository.create(admin);
    await gymRepository.create(gym);
    await clientRepository.create(client);
    const date = new Date("2026-01-15T12:00:00.000Z");

    const result = await sut.execute({
      Id: admin.id.toString(),
      userId: client.id.toString(),
      date,
      price: 99.9,
      methods: "pix",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ message: "PaymentHistory Created" });
    expect(paymentHistoryRepository.items[0]).toMatchObject({
      adminId: admin.id.toString(),
      userId: client.id.toString(),
      date,
      price: 99.9,
      methods: "pix",
    });
    expect(clientRepository.items[0]?.status).toBe("Disponible");
  });

  it("deve rejeitar admin inexistente", async () => {
    const result = await sut.execute({
      Id: "admin-inexistente",
      userId: "client-01",
      date: new Date(),
      price: 10,
      methods: "pix",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new NotAllowedError("Id not allowed!"));
    expect(paymentHistoryRepository.items).toHaveLength(0);
  });

  it("deve rejeitar cliente de outra academia", async () => {
    const admin = MakeAdmin({ gymId: "gym-placeholder" });
    const gym = MakeGym({ adminId: admin.id.toString() });
    const client = MakeClient({ gymId: "outra-academia" });
    await adminRepository.create(admin);
    await gymRepository.create(gym);
    await clientRepository.create(client);

    const result = await sut.execute({
      Id: admin.id.toString(),
      userId: client.id.toString(),
      date: new Date(),
      price: 10,
      methods: "pix",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new NotAllowedError("client not allowed!"));
    expect(paymentHistoryRepository.items).toHaveLength(0);
  });

  it("deve rejeitar quando a academia do admin não existe", async () => {
    const admin = MakeAdmin({ gymId: "gym-inexistente" });
    await adminRepository.create(admin);
    const result = await sut.execute({
      Id: admin.id.toString(),
      userId: "client-01",
      date: new Date(),
      price: 10,
      methods: "pix",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new NotFoundError("gym not found"));
  });
});
