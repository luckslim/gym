import type { Gym } from "@/domain/enterprise/gym-entity";

export interface gymRepository {
  create(gym: Gym): Promise<Gym>;
  findByEmail(email: string): Promise<Gym | null>;
  findByGymName(gymName: string): Promise<Gym | null>;
  findById(id: string): Promise<Gym | null>;
  findByAdminId(id: string): Promise<Gym | null>;
  findManyByGymIds(id: string[]): Promise<Gym[] | null>;
  save(gym: Gym): Promise<Gym>;
  delete(id: string): Promise<void>;
}
