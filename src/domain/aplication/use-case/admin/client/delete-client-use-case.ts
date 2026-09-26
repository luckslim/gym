import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../repository/admin-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import { NotAllowedError } from "@/core/error/not-allowed-error";
import type { clientRepository } from "@/domain/aplication/repository/user-repository";

interface DeleteClientRequest {
  Id: string;
  userId: string;
}

type DeleteClientResponse = Either<
  NotFoundError | NotAllowedError,
  { message: string }
>;

export class DeleteClientUseCase {
  constructor(
    public clientRepository: clientRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    userId,
  }: DeleteClientRequest): Promise<DeleteClientResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotFoundError("Id from admin not found!"));
    }

    const client = await this.clientRepository.findById(userId);

    if (!client) {
      return left(new NotFoundError("Id from client not found!"));
    }

    if (client.gymId != admin.gymId) {
      return left(new NotAllowedError("Id from client and admin not allowed"));
    }

    await this.clientRepository.delete(client.id.toString());

    return right({ message: "Client Deleted" });
  }
}
