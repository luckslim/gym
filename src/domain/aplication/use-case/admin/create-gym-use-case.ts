import { left, right, type Either } from "@/core/either";
import { EmailAlreadyExistError } from "@/core/error/email-already-exist-error";
import type { gymRepository } from "../../repository/gym-repository";
import type { HashGenerator } from "../../cryptography/hash-generator";

import { NotAllowedError } from "@/core/error/not-allowed-error";
import { Gym } from "@/domain/enterprise/gym-entity";
import type { adminRepository } from "../../repository/admin-repository";

interface CreateGymRequest {
  Id: string;
}

type CreateGymResponse = Either<
  EmailAlreadyExistError | NotAllowedError,
  { message: string }
>;

export class CreateGymUseCase {
  constructor(
    public gymRepository: gymRepository,
    public adminRepository: adminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({ Id }: CreateGymRequest): Promise<CreateGymResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotAllowedError("Admin not found"));
    }

    const gym = Gym.create({
      adminId: admin.id.toString(),
      urlImage: admin.urlImage,
      street: admin.street,
      state: admin.state,
      gymName: "Gym",
      number: admin.number,
      city: admin.city,
      cep: admin.cep,
    });

    await this.gymRepository.create(gym);

    admin.gymId = gym.id.toString();

    await this.adminRepository.save(admin);

    return right({ message: "Gym created successfully" });
  }
}
