import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../repository/admin-repository";
import type { paymentHistoryRepository } from "../../../repository/payment-history-repository";
import { PaymentHistory } from "@/domain/enterprise/payment-history-entity";
import { NotFoundError } from "@/core/error/not-found-error";
import type { clientRepository } from "../../../repository/user-repository";
import type { gymRepository } from "../../../repository/gym-repository";
import { NotAllowedError } from "@/core/error/not-allowed-error";

interface CreatePaymentHistoryRequest {
  Id: string;
  userId: string;
  date: Date;
  price: number;
  methods: string;
}

type CreatePaymentHistoryResponse = Either<
  NotFoundError | NotAllowedError,
  { message: string }
>;

export class CreatePaymentHistoryUseCase {
  constructor(
    public paymentHistoryRepository: paymentHistoryRepository,
    public clientRepository: clientRepository,
    public adminRepository: adminRepository,
    public gymRepository: gymRepository,
  ) {}
  async execute({
    Id,
    date,
    userId,
    price,
    methods,
  }: CreatePaymentHistoryRequest): Promise<CreatePaymentHistoryResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotAllowedError("Id not allowed!"));
    }

    const gym = await this.gymRepository.findByAdminId(admin.id.toString());

    if (!gym) {
      return left(new NotFoundError("gym not found"));
    }

    const client = await this.clientRepository.findById(userId);

    if (!client) {
      return left(new NotFoundError("client not found"));
    }

    if (client.gymId != gym.id.toString()) {
      return left(new NotAllowedError("client not allowed!"));
    }

    const pay = PaymentHistory.create({
      date,
      methods,
      adminId: admin.id.toString(),
      userId,
      price,
    });

    await this.paymentHistoryRepository.create(pay);

    client.status = "Disponible";

    await this.clientRepository.save(client);

    return right({ message: "PaymentHistory Created" });
  }
}
