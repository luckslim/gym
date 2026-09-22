import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../repository/admin-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import type { gymRepository } from "../../repository/gym-repository";
import type { Gym } from "@/domain/enterprise/gym-entity";

interface GetGymRequest {
  Id: string;
}

type GetGymResponse = Either<NotFoundError, { gym: Gym }>;

export class GetGymUseCase {
  constructor(
    public adminRepository: adminRepository,
    public gymRepository: gymRepository,
  ) {}
  async execute({ Id }: GetGymRequest): Promise<GetGymResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotFoundError("Admin not found"));
    }

    const gym = await this.gymRepository.findByAdminId(admin.id.toString());

    if (!gym) {
      return left(new NotFoundError("Gym not found"));
    }

    return right({ gym });
  }
}
