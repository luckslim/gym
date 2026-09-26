import { left, right, type Either } from "@/core/either";
import { NotFoundError } from "@/core/error/not-found-error";
import type { Client } from "@/domain/enterprise/client-entity";
import type { clientRepository } from "../../repository/user-repository";

interface GetClientRequest {
  Id: string;
}

type GetClientResponse = Either<NotFoundError, { client: Client }>;

export class GetClientUseCase {
  constructor(public clientRepository: clientRepository) {}
  async execute({ Id }: GetClientRequest): Promise<GetClientResponse> {
    const client = await this.clientRepository.findById(Id);

    if (!client) {
      return left(new NotFoundError("Client not found"));
    }

    return right({ client });
  }
}
