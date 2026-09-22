import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../repository/admin-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import type { Admin } from "@/domain/enterprise/admin-entity";

interface GetAdminRequest {
  Id: string;
}

type GetAdminResponse = Either<NotFoundError, { admin: Admin }>;

export class GetAdminUseCase {
  constructor(public adminRepository: adminRepository) {}
  async execute({ Id }: GetAdminRequest): Promise<GetAdminResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotFoundError("Admin not found"));
    }

    return right({ admin });
  }
}
