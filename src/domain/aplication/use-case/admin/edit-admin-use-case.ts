import { NotAllowedError } from "@/core/error/not-allowed-error";
import type { HashGenerator } from "../../cryptography/hash-generator";
import type { adminRepository } from "../../repository/admin-repository";
import { left, right, type Either } from "@/core/either";

interface EditAdminRequest {
  Id: string;
  urlImage: string;
  name: string;
  email: string;
  password: string;
  city: string;
  cep: number;
  street: string;
  state: string;
  number: number;
  cellphone: number;
  cpf: number;
}

type EditAdminResponse = Either<NotAllowedError, { message: string }>;

export class EditAdminUseCase {
  constructor(
    public adminRepository: adminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    Id,
    urlImage,
    name,
    email,
    password,
    city,
    cep,
    street,
    state,
    number,
    cellphone,
    cpf,
  }: EditAdminRequest): Promise<EditAdminResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new NotAllowedError("Admin not found"));
    }

    if (admin.id.toString() != Id) {
      return left(
        new NotAllowedError("You are not allowed to edit this admin"),
      );
    }

    const passwordHashed = await this.hashGenerator.hash(password);

    admin.name = name;
    admin.email = email;
    admin.password = passwordHashed;
    admin.city = city;
    admin.cep = cep;
    admin.cellphone = cellphone;
    admin.cpf = cpf;
    admin.urlImage = urlImage;
    admin.state = state;
    admin.street = street;
    admin.number = number;
    
    await this.adminRepository.save(admin);

    return right({ message: "Admin edited successfully" });
  }
}
