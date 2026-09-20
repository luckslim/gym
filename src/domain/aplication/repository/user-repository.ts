import type { Client } from "@/domain/enterprise/user-entity";

export interface clientRepository {
  create(client: Client): Promise<Client>;
  findByEmail(email: string): Promise<Client | null>;
  findByClientName(clientName: string): Promise<Client | null>;
  findById(id: string): Promise<Client | null>;
  findManyByClientIds(id: string[]): Promise<Client[] | null>;
  save(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
}
