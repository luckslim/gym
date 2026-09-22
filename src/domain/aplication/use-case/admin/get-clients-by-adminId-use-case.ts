import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../repository/admin-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import { Client } from "@/domain/enterprise/client-entity";
import type { clientRepository } from "../../repository/user-repository";
import type { paymentHistoryRepository } from "../../repository/payment-history-repository";

interface GetClientRequest {
  Id: string;
  page?: number;
  name?: string;
  status?: string;
  dateInitial: Date;
  dateFinal: Date;
}

type GetClientResponse = Either<
  NotFoundError,
  { clientPayedStatus: Client[] | null; clientNotPayedStatus: Client[] | null }
>;

export class GetClientUseCase {
  constructor(
    public adminRepository: adminRepository,
    public paymentHistoryRepository: paymentHistoryRepository,
    public clientRepository: clientRepository,
  ) {}
  async execute({
    Id,
    page,
    status,
    name,
    dateInitial,
    dateFinal,
  }: GetClientRequest): Promise<GetClientResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotFoundError("Admin not found"));
    }

    //return payments doned
    const payDoneForClients =
      await this.paymentHistoryRepository.findClientsByGymIdAndDate(
        admin.gymId,
        dateInitial,
        dateFinal,
      );

    if (!payDoneForClients) {
      return left(new NotFoundError("payments not founds"));
    }

    const data = payDoneForClients.map((item) => item.userId);

    //return clients that payed
    const clientPayed = await this.clientRepository.findByIds(data);
    
    //mutate status from client
    const clientPayedStatus =
      await this.clientRepository.clientPayStatus(clientPayed);

    //return clients that not payed
    const clientNotPayed =
      await this.clientRepository.findByIdsContraries(data);

    //mutate status from client
    const clientNotPayedStatus =
      await this.clientRepository.clientPayStatus(clientNotPayed);

    return right({ clientPayedStatus, clientNotPayedStatus });
  }
}
