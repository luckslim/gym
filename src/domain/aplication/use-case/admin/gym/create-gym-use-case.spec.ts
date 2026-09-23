import { NotAllowedError } from "@/core/error/not-allowed-error";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { FakeHashGenerator } from "../../../../../../test/cryptography/fake-hash-generator";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGymRepository } from "../../../../../../test/in-memory-repository/in-memory-gym-repository";
import { CreateGymUseCase } from "./create-gym-use-case";

describe("Create gym", () => {
  it("deve criar uma academia e vincula-la ao admin", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const gymRepository = new InMemoryGymRepository();
    const admin = MakeAdmin({ gymId: "sem-academia" });
    await adminRepository.create(admin);
    const sut = new CreateGymUseCase(
      gymRepository,
      adminRepository,
      new FakeHashGenerator(),
    );

    const result = await sut.execute({ Id: admin.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ message: "Gym created successfully" });
    expect(gymRepository.items).toHaveLength(1);
    expect(gymRepository.items[0]).toMatchObject({
      adminId: admin.id.toString(),
      gymName: "Gym",
      city: admin.city,
      cep: admin.cep,
    });
    expect(admin.gymId).toBe(gymRepository.items[0]?.id.toString());
  });

  it("deve rejeitar a criação quando o admin não existe", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const gymRepository = new InMemoryGymRepository();
    const sut = new CreateGymUseCase(
      gymRepository,
      adminRepository,
      new FakeHashGenerator(),
    );

    const result = await sut.execute({ Id: "admin-inexistente" });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new NotAllowedError("Admin not found"));
    expect(gymRepository.items).toHaveLength(0);
  });
});
