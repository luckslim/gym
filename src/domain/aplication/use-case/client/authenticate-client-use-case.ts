import { left, right, type Either } from "@/core/either";

import type { HashComparer } from "../../cryptography/hash-comparer";
import type { Encrypter } from "../../cryptography/encrypter";
import { WrongCredentialsError } from "@/core/error/wrong-credentials-error";
import type { clientRepository } from "../../repository/user-repository";

interface AuthenticateClientRequest {
  email: string;
  password: string;
}

type AuthenticateClientResponse = Either<
  WrongCredentialsError,
  { access_token: string }
>;

export class AuthenticateClientUseCase {
  constructor(
    private clientRepository: clientRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateClientRequest): Promise<AuthenticateClientResponse> {
    const client = await this.clientRepository.findByEmail(email);

    if (!client) {
      return left(new WrongCredentialsError());
    }

    const passwordValid = await this.hashComparer.comparer(
      password,
      client.password,
    );

    if (!passwordValid) {
      return left(new WrongCredentialsError());
    }

    const access_token = await this.encrypter.encrypt({
      sub: client.id,
    });

    return right({ access_token });
  }
}
