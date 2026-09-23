import { NotAllowedError } from "@/core/error/not-allowed-error";
import { NotFoundError } from "@/core/error/not-found-error";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeClient } from "../../../../../../test/factory/make-user";
import { MakeGym } from "../../../../../../test/factory/make-gym";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../../test/in-memory-repository/in-memory-client-repository";
import { InMemoryGymRepository } from "../../../../../../test/in-memory-repository/in-memory-gym-repository";
import { GetClientByNameUseCase } from "./get-client-by-name-use-case";

let adminRepository: InMemoryAdminRepository;
let clientRepository: InMemoryClientRepository;
let gymRepository: InMemoryGymRepository;
let sut: GetClientByNameUseCase;

describe("Get client by name", () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    clientRepository = new InMemoryClientRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new GetClientByNameUseCase(
      adminRepository,
      clientRepository,
      gymRepository,
    );
  });

  it("deve retornar cliente da academia do admin", async () => {
    const admin = MakeAdmin({ gymId: "gym-placeholder" });
    const gym = MakeGym({ adminId: admin.id.toString() });
    const client = MakeClient({
      name: "Maria Silva",
      gymId: gym.id.toString(),
    });
    await adminRepository.create(admin);
    await gymRepository.create(gym);
    await clientRepository.create(client);
    const result = await sut.execute({
      Id: admin.id.toString(),
      name: "Maria Silva",
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ client });
  });

  it("deve rejeitar admin inexistente", async () => {
    const result = await sut.execute({
      Id: "admin-inexistente",
      name: "Maria",
    });
    expect(result.value).toEqual(new NotAllowedError("Id not allowed"));
  });

  it("deve rejeitar cliente de outra academia", async () => {
    const admin = MakeAdmin({ gymId: "gym-placeholder" });
    const gym = MakeGym({ adminId: admin.id.toString() });
    const client = MakeClient({ name: "Maria Silva", gymId: "outra-academia" });
    await adminRepository.create(admin);
    await gymRepository.create(gym);
    await clientRepository.create(client);
    const result = await sut.execute({
      Id: admin.id.toString(),
      name: "Maria Silva",
    });
    expect(result.value).toEqual(new NotAllowedError("is not permission!"));
  });

  it("deve retornar erro quando o cliente não existe", async () => {
    const admin = MakeAdmin({ gymId: "gym-placeholder" });
    await adminRepository.create(admin);
    await gymRepository.create(MakeGym({ adminId: admin.id.toString() }));
    const result = await sut.execute({
      Id: admin.id.toString(),
      name: "Maria",
    });
    expect(result.value).toEqual(new NotFoundError("Client not found"));
  });
});
