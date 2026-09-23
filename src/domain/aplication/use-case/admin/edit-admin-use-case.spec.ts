import { NotAllowedError } from "@/core/error/not-allowed-error";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { FakeHashGenerator } from "../../../../../test/cryptography/fake-hash-generator";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { EditAdminUseCase } from "./edit-admin-use-case";

describe("Edit admin", () => {
  it("deve atualizar os dados do admin e gerar novo hash", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const admin = MakeAdmin({ password: "senha-antiga" });
    await adminRepository.create(admin);
    const sut = new EditAdminUseCase(adminRepository, new FakeHashGenerator());

    const result = await sut.execute({
      Id: admin.id.toString(),
      urlImage: "new-image.png",
      name: "Ana Silva",
      email: "ana@example.com",
      password: "senha-nova",
      city: "Recife",
      cep: 50000000,
      cellphone: 81999999999,
      cpf: 98765432100,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ message: "Admin edited successfully" });
    expect(adminRepository.items[0]).toMatchObject({
      urlImage: "new-image.png",
      name: "Ana Silva",
      email: "ana@example.com",
      password: "hashed-senha-nova",
      city: "Recife",
      cep: 50000000,
      cellphone: 81999999999,
      cpf: 98765432100,
    });
  });

  it("deve rejeitar admin inexistente", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const sut = new EditAdminUseCase(adminRepository, new FakeHashGenerator());
    const result = await sut.execute({
      Id: "admin-inexistente",
      urlImage: "image.png",
      name: "Ana",
      email: "ana@example.com",
      password: "senha",
      city: "Recife",
      cep: 50000000,
      cellphone: 81999999999,
      cpf: 98765432100,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new NotAllowedError("Admin not found"));
  });
});
