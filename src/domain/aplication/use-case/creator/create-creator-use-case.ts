import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/error/email-already-exist-error";
import type { HashGenerator } from "../../cryptography/hash-generator";

import { NotAllowedError } from "@/core/error/not-allowed-error";
import { Creator } from "@/domain/enterprise/creator-entity";
import type { creatorRepository } from "../../repository/creator-repository";

interface CreateCreatorRequest {
  userName: string;
  password: string;
}

type CreateCreatorResponse = Either<
  EmailAlreadyExistError | NotAllowedError,
  { message: string }
>;

export class CreateCreatorUseCase {
  constructor(
    public creatorRepository: creatorRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    userName,
    password,
  }: CreateCreatorRequest): Promise<CreateCreatorResponse> {
    const creator = await this.creatorRepository.findByUserName(userName);

    if (creator) {
      return left(new NotAllowedError("Creator already exist"));
    }

    const isCreator = Creator.create({
      userName,
      password,
      isActive: false,
    });

    await this.creatorRepository.create(isCreator);

    return right({ message: "Creator created successfully" });
  }
}
