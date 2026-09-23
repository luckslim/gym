import type { gymRepository } from "@/domain/aplication/repository/gym-repository";
import type { Gym } from "@/domain/enterprise/gym-entity";

export class InMemoryGymRepository implements gymRepository {
  public items: Gym[] = [];

  async create(gym: Gym): Promise<Gym> {
    this.items.push(gym);
    return gym;
  }

  async findByEmail(_email: string): Promise<Gym | null> {
    return null;
  }

  async findByGymName(gymName: string): Promise<Gym | null> {
    return this.items.find((gym) => gym.gymName === gymName) ?? null;
  }

  async findById(id: string): Promise<Gym | null> {
    return this.items.find((gym) => gym.id.toString() === id) ?? null;
  }

  async findByAdminId(id: string): Promise<Gym | null> {
    return this.items.find((gym) => gym.adminId === id) ?? null;
  }

  async findManyByGymIds(ids: string[]): Promise<Gym[] | null> {
    return this.items.filter((gym) => ids.includes(gym.id.toString()));
  }

  async save(gym: Gym): Promise<Gym> {
    const index = this.items.findIndex((item) => item.id === gym.id);
    if (index === -1) this.items.push(gym);
    else this.items[index] = gym;
    return gym;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((gym) => gym.id.toString() !== id);
  }
}
