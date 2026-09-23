import type { UniqueEntityID } from "@/core/entity/unique-entityId";
import { Client, type ClientProps } from "@/domain/enterprise/client-entity";
import { faker } from "@faker-js/faker";

export function MakeClient(
  override: Partial<ClientProps>,
  id?: UniqueEntityID,
) {
  const client = Client.create(
    {
      gymId: faker.string.uuid(),
      urlImage: faker.image.url(),
      status: faker.helpers.arrayElement(["active", "inactive"]),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      city: faker.location.city(),
      cep: faker.number.int({ min: 10000000, max: 99999999 }),
      cellphone: faker.number.int({ min: 1000000000, max: 9999999999 }),
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }),
      dateOfCreation: faker.date.past(),
      ...override,
    },
    id,
  );
  return client;
}
