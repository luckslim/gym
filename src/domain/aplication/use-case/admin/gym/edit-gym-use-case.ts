import { NotAllowedError } from "@/core/error/not-allowed-error";
import type { HashGenerator } from "../../../cryptography/hash-generator";
import type { gymRepository } from "../../../repository/gym-repository";
import { left, right, type Either } from "@/core/either";
import type { adminRepository } from "../../../repository/admin-repository";
import type { NotFoundError } from "@/core/error/not-found-error";
import type { Uploader } from "../../../storage/uploader";
import { Upload } from "@/domain/enterprise/upload-entity";
import { randomUUID } from "node:crypto";

interface EditGymRequest {
  Id: string;
  urlImage: string;
  gymName: string;
  street: string;
  state: string;
  number: number;
  city: string;
  cep: number;
  body: Buffer | null;
  mimeType: string | null;
}

type EditGymResponse = Either<
  NotAllowedError | NotFoundError,
  { message: string }
>;

export class EditGymUseCase {
  constructor(
    public gymRepository: gymRepository,
    public uploadStorage: Uploader,
    public adminRepository: adminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    Id,
    urlImage,
    gymName,
    street,
    state,
    number,
    city,
    cep,
    body,
    mimeType,
  }: EditGymRequest): Promise<EditGymResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotAllowedError("Admin not found"));
    }

    const gym = await this.gymRepository.findById(admin.gymId);

    if (!gym) {
      return left(new NotAllowedError("Gym not found"));
    }

    if (gym.adminId != Id) {
      return left(new NotAllowedError("You are not allowed to edit this gym"));
    }

    const fileName = `${gym.gymName}-${randomUUID()}`;

    const upload = Upload.create({
      body,
      userId: admin.id.toString(),
      fileName,
      mimeType,
    });

    await this.uploadStorage.upload(upload);

    gym.city = city;
    gym.cep = cep;
    gym.street = street;
    gym.state = state;
    gym.gymName = gymName;
    gym.number = number;
    gym.urlImage = urlImage;

    await this.gymRepository.save(gym);

    return right({ message: "Gym edited successfully" });
  }
}
