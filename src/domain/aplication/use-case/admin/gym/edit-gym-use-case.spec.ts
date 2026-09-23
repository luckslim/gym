import { NotAllowedError } from "@/core/error/not-allowed-error";
import type { Upload } from "@/domain/enterprise/upload-entity";
import { MakeAdmin } from "../../../../../../test/factory/make-admin";
import { MakeGym } from "../../../../../../test/factory/make-gym";
import { FakeHashGenerator } from "../../../../../../test/cryptography/fake-hash-generator";
import { InMemoryAdminRepository } from "../../../../../../test/in-memory-repository/in-memory-admin-repository";
import { InMemoryGymRepository } from "../../../../../../test/in-memory-repository/in-memory-gym-repository";
import { EditGymUseCase } from "./edit-gym-use-case";

class InMemoryUploader {
  public uploads: Upload[] = [];
  async upload(upload: Upload): Promise<{ result: string }> {
    this.uploads.push(upload);
    return { result: upload.fileName };
  }
  async deleteUpload(_id: string): Promise<void> {}
  async getSignedImageURL(id: string): Promise<string> {
    return id;
  }
}

describe("Edit gym", () => {
  it("deve atualizar a academia e enviar a nova imagem", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const gymRepository = new InMemoryGymRepository();
    const uploader = new InMemoryUploader();
    const admin = MakeAdmin({ gymId: "gym-placeholder" });
    const gym = MakeGym({ adminId: admin.id.toString() });
    admin.gymId = gym.id.toString();
    await adminRepository.create(admin);
    await gymRepository.create(gym);
    const sut = new EditGymUseCase(
      gymRepository,
      uploader,
      adminRepository,
      new FakeHashGenerator(),
    );

    const result = await sut.execute({
      Id: admin.id.toString(),
      urlImage: "updated.png",
      gymName: "Arena Central",
      street: "Rua Nova",
      state: "PE",
      number: 42,
      city: "Recife",
      cep: 50000000,
      body: Buffer.from("image"),
      mimeType: "image/png",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ message: "Gym edited successfully" });
    expect(gymRepository.items[0]).toMatchObject({
      gymName: "Arena Central",
      urlImage: "updated.png",
      street: "Rua Nova",
      state: "PE",
      number: 42,
      city: "Recife",
      cep: 50000000,
    });
    expect(uploader.uploads).toHaveLength(1);
    expect(uploader.uploads[0]).toMatchObject({
      userId: admin.id.toString(),
      body: Buffer.from("image"),
      mimeType: "image/png",
    });
  });

  it("deve rejeitar academia que não pertence ao admin", async () => {
    const adminRepository = new InMemoryAdminRepository();
    const gymRepository = new InMemoryGymRepository();
    const uploader = new InMemoryUploader();
    const admin = MakeAdmin({ gymId: "gym-inexistente" });
    await adminRepository.create(admin);
    const sut = new EditGymUseCase(
      gymRepository,
      uploader,
      adminRepository,
      new FakeHashGenerator(),
    );
    const result = await sut.execute({
      Id: admin.id.toString(),
      urlImage: "image.png",
      gymName: "Arena",
      street: "Rua",
      state: "SP",
      number: 1,
      city: "Sao Paulo",
      cep: 10000000,
      body: null,
      mimeType: null,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new NotAllowedError("Gym not found"));
    expect(uploader.uploads).toHaveLength(0);
  });
});
