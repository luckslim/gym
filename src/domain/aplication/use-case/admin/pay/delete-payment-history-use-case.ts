import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../repository/admin-repository";
import type { paymentHistoryRepository } from "../../../repository/payment-history-repository";
import { NotFoundError } from "@/core/error/not-found-error";
import { NotAllowedError } from "@/core/error/not-allowed-error";

interface DeletePaymentHistoryRequest {
  Id: string;
  payId: string;
}

type DeletePaymentHistoryResponse = Either<
  NotFoundError | NotAllowedError,
  { message: string }
>;

export class DeletePaymentHistoryUseCase {
  constructor(
    public paymentHistoryRepository: paymentHistoryRepository,
    public adminRepository: adminRepository,
  ) {}
  async execute({
    Id,
    payId,
  }: DeletePaymentHistoryRequest): Promise<DeletePaymentHistoryResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotFoundError("Id from admin not found!"));
    }

    const pay = await this.paymentHistoryRepository.findById(payId);

    if (!pay) {
      return left(new NotFoundError("Id from pay not found!"));
    }

    if (pay.adminId != admin.id.toString()) {
      return left(new NotAllowedError("Id from pay and admin not allowed"));
    }

    await this.paymentHistoryRepository.delete(pay.id.toString());

    return right({ message: "PaymentHistory Deleted" });
  }
}
