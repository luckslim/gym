import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../repository/admin-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import type { Client } from "@/domain/enterprise/client-entity";
import type { clientRepository } from "../../../repository/user-repository";
import { NotAllowedError } from "@/core/error/not-allowed-error";
import type { gymRepository } from "../../../repository/gym-repository";

interface GetClientByNameRequest {
  Id: string;
  name: string;
}

type GetClientByNameResponse = Either<NotFoundError, { client: Client }>;

export class GetClientByNameUseCase {
  constructor(
    public adminRepository: adminRepository,
    public clientRepository: clientRepository,
    public gymRepository: gymRepository,
  ) {}
  async execute({
    name,
    Id,
  }: GetClientByNameRequest): Promise<GetClientByNameResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotAllowedError("Id not allowed"));
    }

    const gym = await this.gymRepository.findByAdminId(admin.id.toString());

    if (!gym) {
      return left(new NotFoundError("gym not found"));
    }

    const client = await this.clientRepository.findByName(name);

    if (!client) {
      return left(new NotFoundError("Client not found"));
    }

    if (client.gymId != gym.id.toString()) {
      return left(new NotAllowedError("is not permission!"));
    }

    return right({ client });
  }
}
