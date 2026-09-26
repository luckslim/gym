import type { HashGenerator } from "../../cryptography/hash-generator";
import { left, right, type Either } from "@/core/either";
import type { creatorRepository } from "../../repository/creator-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import { NotAllowedError } from "@/core/error/not-allowed-error";

interface EditEditStatusCreatorRequest {
  Id: string;
  creatorId: string;
  isActive: boolean;
}

type EditEditStatusCreatorResponse = Either<
  NotFoundError | NotAllowedError,
  { message: string }
>;

export class EditEditStatusCreatorUseCase {
  constructor(
    public creatorRepository: creatorRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    Id,
    isActive,
    creatorId,
  }: EditEditStatusCreatorRequest): Promise<EditEditStatusCreatorResponse> {
    const creator = await this.creatorRepository.findById(Id);

    if (!creator) {
      return left(new NotFoundError("Id not Found"));
    }

    if ((creator.isActive = false)) {
      return left(new NotAllowedError("Id not actived"));
    }

    const newCreator = await this.creatorRepository.findById(creatorId);

    if (!newCreator) {
      return left(new NotFoundError("Id not Found"));
    }

    newCreator.isActive = isActive;

    await this.creatorRepository.save(newCreator);

    return right({ message: "Status Creator edited successfully" });
  }
}
