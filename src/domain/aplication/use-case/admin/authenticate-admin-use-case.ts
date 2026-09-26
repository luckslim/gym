import { left, right, type Either } from "@/core/either";

import type { HashComparer } from "../../cryptography/hash-comparer";
import type { adminRepository } from "../../repository/admin-repository";
import type { Encrypter } from "../../cryptography/encrypter";
import { WrongCredentialsError } from "@/core/error/wrong-credentials-error";

interface AuthenticateAdminRequest {
  email: string;
  password: string;
}

type AuthenticateAdminResponse = Either<
  WrongCredentialsError,
  { access_token: string }
>;

export class AuthenticateAdminUseCase {
  constructor(
    private adminRepository: adminRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateAdminRequest): Promise<AuthenticateAdminResponse> {
    const admin = await this.adminRepository.findByEmail(email);

    if (!admin) {
      return left(new WrongCredentialsError());
    }

    const passwordValid = await this.hashComparer.comparer(
      password,
      admin.password,
    );

    if (!passwordValid) {
      return left(new WrongCredentialsError());
    }

    const access_token = await this.encrypter.encrypt({
      sub: admin.id,
    });

    return right({ access_token });
  }
}
