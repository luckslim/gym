import { left, right, type Either } from "@/core/either";
import { NotFoundError } from "@/core/error/not-found-error";
import { NotAllowedError } from "@/core/error/not-allowed-error";
import type { creatorRepository } from "../../repository/creator-repository";
interface DeleteCreatorRequest {
  Id: string;
  creatorId: string;
}

type DeleteCreatorResponse = Either<
  NotFoundError | NotAllowedError,
  { message: string }
>;

export class DeleteCreatorUseCase {
  constructor(public creatorRepository: creatorRepository) {}
  async execute({
    Id,
    creatorId,
  }: DeleteCreatorRequest): Promise<DeleteCreatorResponse> {
   const creator = await this.creatorRepository.findById(Id);

    if (!creator) {
      return left(new NotFoundError("Id not Found"));
    }

    if ((creator.isActive = false)) {
      return left(new NotAllowedError("Id not actived"));
    }

    await this.creatorRepository.delete(creatorId);

    return right({ message: "Creator Deleted" });
  }
}
