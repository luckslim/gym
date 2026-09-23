import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../repository/admin-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import { Client } from "@/domain/enterprise/client-entity";
import type {
  clientRepository,
  FindClientsWithPaymentStatusParams,
} from "../../../repository/user-repository";

interface GetClientRequest {
  Id: string;
  page?: number;
  perPage?: number;
  name?: string;
  email?: string;
  city?: string;
  cep?: number;
  cellphone?: number;
  cpf?: number;
  status?: "paid" | "not-paid";
  dateInitial: Date;
  dateFinal: Date;
}

type GetClientResponse = Either<NotFoundError, Client[]>;

export class GetClientUseCase {
  constructor(
    public adminRepository: adminRepository,
    public clientRepository: clientRepository,
  ) {}

  async execute({
    Id,
    page = 1,
    perPage = 20,
    name,
    email,
    city,
    cep,
    cellphone,
    cpf,
    status,
    dateInitial,
    dateFinal,
  }: GetClientRequest): Promise<GetClientResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotFoundError("Admin not found"));
    }

    const params: FindClientsWithPaymentStatusParams = {
      gymId: admin.gymId,
      dateInitial,
      dateFinal,
      page,
      perPage,
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(city !== undefined && { city }),
      ...(cep !== undefined && { cep }),
      ...(cellphone !== undefined && { cellphone }),
      ...(cpf !== undefined && { cpf }),
      ...(status !== undefined && { status }),
    };

    const result =
      await this.clientRepository.findClientsWithPaymentStatus(params);

    return right(result);
  }
}
