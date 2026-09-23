import type { UniqueEntityID } from "@/core/entity/unique-entityId";
import { Creator, type CreatorProps } from "@/domain/enterprise/creator-entity";
import { faker } from "@faker-js/faker";

export function MakeCreator(
  override: Partial<CreatorProps>,
  id?: UniqueEntityID,
) {
  return Creator.create(
    {
      userName: faker.internet.username(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );
}
