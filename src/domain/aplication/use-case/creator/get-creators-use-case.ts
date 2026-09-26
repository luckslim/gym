import { left, right, type Either } from "@/core/either";
import type { creatorRepository } from "../../repository/creator-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import type { Creator } from "@/domain/enterprise/creator-entity";
import { NotAllowedError } from "@/core/error/not-allowed-error";

interface GetCreatorRequest {
  Id: string;
}

type GetCreatorResponse = Either<NotFoundError, { creators: Creator[] }>;

export class GetCreatorUseCase {
  constructor(public creatorRepository: creatorRepository) {}
  async execute({ Id }: GetCreatorRequest): Promise<GetCreatorResponse> {
    const creator = await this.creatorRepository.findById(Id)

    if(!creator){
        return left(new NotAllowedError("Id not allowed"))
    }

    if(creator.isActive = false){
        return left(new NotAllowedError("Id not Allowed"))
    }

    const creators = await this.creatorRepository.findManyById();

    if (!creators) {
      return left(new NotFoundError("Creators not found"));
    }

    return right({ creators });
  }
}
