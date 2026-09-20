import type { Creator } from "@/domain/enterprise/creator-entity";

export interface creatorRepository {
  create(creator: Creator): Promise<Creator>;
  fyndById(id: string): Promise<Creator | null>;
  save(creator: Creator): Promise<Creator>;
  delete(id: string): Promise<void>;
}
