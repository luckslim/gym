import type { creatorRepository } from "@/domain/aplication/repository/creator-repository";
import type { Creator } from "@/domain/enterprise/creator-entity";

export class InMemoryCreatorRepository implements creatorRepository {
  public items: Creator[] = [];

  async create(creator: Creator): Promise<Creator> {
    this.items.push(creator);
    return creator;
  }

  async fyndById(id: string): Promise<Creator | null> {
    return this.items.find((creator) => creator.id.toString() === id) ?? null;
  }

  async save(creator: Creator): Promise<Creator> {
    const index = this.items.findIndex((item) => item.id === creator.id);
    if (index === -1) this.items.push(creator);
    else this.items[index] = creator;
    return creator;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((creator) => creator.id.toString() !== id);
  }
}
