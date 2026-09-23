import type { clientRepository } from "@/domain/aplication/repository/user-repository";
import type { Client } from "@/domain/enterprise/client-entity";

export class InMemoryClientRepository implements clientRepository {
  public items: Client[] = [];

  async create(client: Client): Promise<Client> {
    this.items.push(client);
    return client;
  }
  async findByEmail(email: string): Promise<Client | null> {
    return this.items.find((client) => client.email === email) ?? null;
  }
  async findByName(name: string): Promise<Client | null> {
    return this.items.find((client) => client.name === name) ?? null;
  }
  async findById(id: string): Promise<Client | null> {
    return this.items.find((client) => client.id.toString() === id) ?? null;
  }
  async findByIds(ids: string[]): Promise<Client[] | null> {
    return this.items.filter((client) => ids.includes(client.id.toString()));
  }
  async findByIdsContraries(ids: string[]): Promise<Client[] | null> {
    return this.items.filter((client) => !ids.includes(client.id.toString()));
  }
  async clientPayStatus(
    client: Client[] | null,
    status: string,
  ): Promise<Client[] | null> {
    client?.forEach((item) => {
      item.status = status;
    });
    return client;
  }
  async findManyByGymIdWithParams(
    gymId?: string,
    page?: number,
    status?: string,
    name?: string,
  ): Promise<Client[] | null> {
    const filtered = this.items.filter((client) => {
      const item = client as Client & { gymId?: string; status?: string };
      return (
        (!gymId || item.gymId === gymId) &&
        (!status || item.status === status) &&
        (!name || client.name.toLowerCase().includes(name.toLowerCase()))
      );
    });
    const pageSize = 10;
    const start = Math.max(0, ((page ?? 1) - 1) * pageSize);
    return filtered.slice(start, start + pageSize);
  }
  async save(client: Client): Promise<Client> {
    const index = this.items.findIndex((item) => item.id === client.id);
    if (index === -1) this.items.push(client);
    else this.items[index] = client;
    return client;
  }
  async delete(id: string): Promise<void> {
    this.items = this.items.filter((client) => client.id.toString() !== id);
  }
}
