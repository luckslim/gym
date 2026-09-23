import type { UniqueEntityID } from "@/core/entity/unique-entityId";
import { Admin, type AdminProps } from "@/domain/enterprise/admin-entity";
import { faker } from "@faker-js/faker";

export function MakeAdmin(
  override: Partial<AdminProps>,
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      gymId: faker.string.uuid(),
      urlImage: faker.image.url(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      city: faker.location.city(),
      cep: faker.number.int({ min: 10000000, max: 99999999 }),
      cellphone: faker.number.int({ min: 1000000000, max: 9999999999 }),
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }),
      number: faker.number.int({ min: 10000000, max: 99999999 }),
      state: faker.location.city(),
      street: faker.location.city(),
      ...override,
    },
    id,
  );
  return admin;
}
