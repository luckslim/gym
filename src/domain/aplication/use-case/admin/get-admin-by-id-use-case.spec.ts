import { NotFoundError } from "@/core/error/not-found-error";
import { MakeAdmin } from "../../../../../test/factory/make-admin";
import { InMemoryAdminRepository } from "../../../../../test/in-memory-repository/in-memory-admin-repository";
import { GetAdminUseCase } from "./get-admin-by-id-use-case";

let adminRepository: InMemoryAdminRepository;
let sut: GetAdminUseCase;

describe("Get admin by id", () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    sut = new GetAdminUseCase(adminRepository);
  });

  it("deve retornar o admin encontrado", async () => {
    const admin = MakeAdmin({ name: "Ana Silva" });
    await adminRepository.create(admin);
    const result = await sut.execute({
      Id: admin.id.toString(),
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ admin });
  });

  it("deve retornar erro quando o admin não existe", async () => {
    const result = await sut.execute({ Id: "admin-inexistente" });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new NotFoundError("Admin not found"));
  });
});
