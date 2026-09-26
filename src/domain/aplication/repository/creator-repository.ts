import type { Creator } from "@/domain/enterprise/creator-entity";

export interface creatorRepository {
  create(creator: Creator): Promise<Creator>;
  findById(id: string): Promise<Creator | null>;
  findManyById(): Promise<Creator[] | null>;
  findByUserName(id: string): Promise<Creator | null>;
  save(creator: Creator): Promise<Creator>;
  delete(id: string): Promise<void>;
}
