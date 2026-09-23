import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryClientRepository } from "../../../../../../test/in-memory-repository/in-memory-client-repository";
import type { HashGenerator } from "../../../cryptography/hash-generator";
import { FakeHashGenerator } from "../../../../../../test/cryptography/fake-hash-generator";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { NotFoundError } from "@/core/error/not-found-error";
import { CreateClientUseCase } from "./create-client-use-case";



let inMemoryClientRepository: InMemoryClientRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let hashGenerator: HashGenerator;
let sut: CreateClientUseCase;

describe("Register client", () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    hashGenerator = new FakeHashGenerator();
    sut = new CreateClientUseCase(
      inMemoryClientRepository,
      inMemoryAdminRepository,
      hashGenerator,
    );
  });

  it("deve criar um cliente associado ao admin e persistir os dados", async () => {
    const admin = MakeAdmin({ gymId: "gym-01" });
    await inMemoryAdminRepository.create(admin);

    const result = await sut.execute({
      Id: admin.id.toString(),
      name: "Maria da Silva",
      email: "maria@example.com",
      password: "senha-segura",
      city: "Sao Paulo",
      cep: 10010000,
      cellphone: 11999999999,
      cpf: 12345678901,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ message: "Client created successfully" });
    expect(inMemoryClientRepository.items).toHaveLength(1);
    expect(inMemoryClientRepository.items[0]).toMatchObject({
      gymId: "gym-01",
      name: "Maria da Silva",
      email: "maria@example.com",
      password: "hashed-senha-segura",
      status: "pending for payment",
      city: "Sao Paulo",
      cep: 10010000,
      cellphone: 11999999999,
      cpf: 12345678901,
    });
    expect(inMemoryClientRepository.items[0]?.dateOfCreation).toBeInstanceOf(
      Date,
    );
  });

  it("não deve criar um cliente quando o admin não existe", async () => {
    const result = await sut.execute({
      Id: "admin-inexistente",
      name: "Maria da Silva",
      email: "maria@example.com",
      password: "senha-segura",
      city: "Sao Paulo",
      cep: 10010000,
      cellphone: 11999999999,
      cpf: 12345678901,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
    expect(result.value).toMatchObject({
      message: "Not Found. Admin not found",
    });
    expect(inMemoryClientRepository.items).toHaveLength(0);
  });
});
