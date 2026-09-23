import { NotFoundError } from "@/core/error/not-found-error";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeGym } from "../../../../../../test/factory/make-gym";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGymRepository } from "../../../../../../test/in-memory-repository/in-memory-gym-repository";
import { GetGymUseCase } from "./get-gym-by-adminId-use-case";

let adminRepository: InMemoryAdminRepository;
let gymRepository: InMemoryGymRepository;
let sut: GetGymUseCase;

describe("Get gym by admin id", () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new GetGymUseCase(adminRepository, gymRepository);
  });

  it("deve retornar a academia vinculada ao admin", async () => {
    const admin = MakeAdmin({ gymId: "gym-placeholder" });
    const gym = MakeGym({ adminId: admin.id.toString() });
    await adminRepository.create(admin);
    await gymRepository.create(gym);
    const result = await sut.execute({ Id: admin.id.toString() });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ gym });
  });

  it("deve retornar erro quando o admin não existe", async () => {
    const result = await sut.execute({ Id: "admin-inexistente" });
    expect(result.value).toEqual(new NotFoundError("Admin not found"));
  });

  it("deve retornar erro quando o admin não possui academia", async () => {
    const admin = MakeAdmin({ gymId: "gym-inexistente" });
    await adminRepository.create(admin);
    const result = await sut.execute({ Id: admin.id.toString() });
    expect(result.value).toEqual(new NotFoundError("Gym not found"));
  });
});
