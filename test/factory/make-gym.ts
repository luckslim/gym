import type { UniqueEntityID } from "@/core/entity/unique-entityId";
import { Gym, type GymProps } from "@/domain/enterprise/gym-entity";
import { faker } from "@faker-js/faker";

export function MakeGym(override: Partial<GymProps>, id?: UniqueEntityID) {
  return Gym.create(
    {
      adminId: faker.string.uuid(),
      gymName: faker.company.name(),
      urlImage: faker.image.url(),
      street: faker.location.street(),
      state: faker.location.state(),
      number: faker.number.int({ min: 1, max: 9999 }),
      city: faker.location.city(),
      cep: faker.number.int({ min: 10000000, max: 99999999 }),
      ...override,
    },
    id,
  );
}
