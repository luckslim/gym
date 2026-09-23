import type { Client } from "@/domain/enterprise/client-entity";

export interface clientRepository {
  create(client: Client): Promise<Client>;
  findByEmail(email: string): Promise<Client | null>;
  findByName(name: string): Promise<Client | null>;
  findById(id: string): Promise<Client | null>;
  findByIds(ids: string[]): Promise<Client[] | null>;
  findByIdsContraries(ids: string[]): Promise<Client[] | null>;
  clientPayStatus(
    client: Client[] | null,
    status: string,
  ): Promise<Client[] | null>;
  findManyByGymIdWithParams(
    gymId?: string,
    page?: number,
    status?: string,
    name?: string,
  ): Promise<Client[] | null>;
  save(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
}
