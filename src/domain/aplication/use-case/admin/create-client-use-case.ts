import { left, right, type Either } from "@/core/either";
import type { EmailAlreadyExistError } from "@/core/error/email-already-exist-error";
import { NotAllowedError } from "@/core/error/not-allowed-error";
import type { clientRepository } from "../../repository/user-repository";
import type { adminRepository } from "../../repository/admin-repository";
import type { HashGenerator } from "../../cryptography/hash-generator";
import { NotFoundError } from "@/core/error/not-found-error";
import { Client } from "@/domain/enterprise/client-entity";

interface CreateClientRequest {
  Id: string;
  name: string;
  email: string;
  password: string;
  city: string;
  cep: number;
  cellphone: number;
  cpf: number;
}

type CreateClientResponse = Either<
  EmailAlreadyExistError | NotAllowedError,
  { message: string }
>;

export class CreateClientUseCase {
  constructor(
    public clientRepository: clientRepository,
    public adminRepository: adminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    Id,
    name,
    email,
    password,
    city,
    cep,
    cellphone,
    cpf,
  }: CreateClientRequest): Promise<CreateClientResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotFoundError("Admin not found"));
    }

    const client = Client.create({
      gymId: admin.gymId,
      urlImage: "undefined",
      name,
      email,
      password,
      status: 'pending for payment',
      city,
      cep,
      cellphone,
      cpf,
      dateOfCreation: new Date(),
    });

    await this.clientRepository.create(client)

    return right({ message: "Client created successfully" });
  }
}
