import { NotAllowedError } from "@/core/error/not-allowed-error";

import { left, right, type Either } from "@/core/either";
import type { clientRepository } from "@/domain/aplication/repository/user-repository";
import type { HashGenerator } from "@/domain/aplication/cryptography/hash-generator";
import { EmailAlreadyExistError } from "@/core/error/email-already-exist-error";

interface EditClientRequest {
  Id: string;
  urlImage: string;
  name: string;
  email: string;
  password: string;
  city: string;
  cep: number;
  cellphone: number;
  cpf: number;
}

type EditClientResponse = Either<NotAllowedError | EmailAlreadyExistError, { message: string }>;

export class EditClientUseCase {
  constructor(
    public clientRepository: clientRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    Id,
    urlImage,
    name,
    email,
    password,
    city,
    cep,
    cellphone,
    cpf,
  }: EditClientRequest): Promise<EditClientResponse> {
    const client = await this.clientRepository.findById(Id);

    if (!client) {
      return left(new NotAllowedError("Client not found"));
    }

    if (client.id.toString() != Id) {
      return left(
        new NotAllowedError("You are not allowed to edit this client"),
      );
    }

    const userAlreadyExist = await this.clientRepository.findByEmail(email);

    if (!userAlreadyExist) {
      return left(new EmailAlreadyExistError(""));
    }

    const passwordHashed = await this.hashGenerator.hash(password);

    client.name = name;
    client.email = email;
    client.password = passwordHashed;
    client.city = city;
    client.cep = cep;
    client.cellphone = cellphone;
    client.cpf = cpf;
    client.urlImage = urlImage;

    await this.clientRepository.save(client);

    return right({ message: "Client edited successfully" });
  }
}
