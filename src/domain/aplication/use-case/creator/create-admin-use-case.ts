import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/error/email-already-exist-error";
import type { adminRepository } from "../../repository/admin-repository";
import type { HashGenerator } from "../../cryptography/hash-generator";

import { NotAllowedError } from "@/core/error/not-allowed-error";
import { Admin } from "@/domain/enterprise/admin-entity";
import type { creatorRepository } from "../../repository/creator-repository";

interface CreateAdminRequest {
  Id: string;
  gymId: string;
  urlImage: string;
  name: string;
  email: string;
  password: string;
  state: string;
  street: string;
  number: number;
  city: string;
  cep: number;
  cellphone: number;
  cpf: number;
}

type CreateAdminResponse = Either<
  EmailAlreadyExistError | NotAllowedError,
  { message: string }
>;

export class CreateAdminUseCase {
  constructor(
    public adminRepository: adminRepository,
    public creatorRepository: creatorRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    Id,
    gymId,
    urlImage,
    name,
    email,
    password,
    city,
    cep,
    cellphone,
    cpf,
    state,
    street,
    number
  }: CreateAdminRequest): Promise<CreateAdminResponse> {
    const creator = await this.creatorRepository.fyndById(Id);
    if (!creator) {
      return left(new NotAllowedError("Creator not found"));
    }

    const passwordHashed = await this.hashGenerator.hash(password);

    const admin = Admin.create({
      gymId: "undefined",
      urlImage: "undefined",
      name,
      street,
      number,
      state,
      email,
      password: passwordHashed,
      city,
      cep,
      cellphone,
      cpf,
    });

    await this.adminRepository.create(admin);

    return right({ message: "Admin created successfully" });
  }
}
