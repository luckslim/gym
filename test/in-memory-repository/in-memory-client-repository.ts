import type {
  clientRepository,
  FindClientsWithPaymentStatusParams,
  PaginatedClients,
} from "@/domain/aplication/repository/user-repository";
import type { Client } from "@/domain/enterprise/client-entity";
import type { PaymentHistory } from "@/domain/enterprise/payment-history-entity";

export class InMemoryClientRepository implements clientRepository {
  public items: Client[] = [];
  public paymentHistoryItems: PaymentHistory[] = [];

  async findClientsWithPaymentStatus(
    params: FindClientsWithPaymentStatusParams,
  ): Promise<Client[]> {
    const paidClientIds = new Set(
      this.paymentHistoryItems
        .filter(
          (payment) =>
            payment.adminId === params.gymId &&
            payment.date >= params.dateInitial &&
            payment.date <= params.dateFinal,
        )
        .map((payment) => payment.userId),
    );

    const filtered = this.items.filter((client) => {
      const isPaid = paidClientIds.has(client.id.toString());
      return (
        client.gymId === params.gymId &&
        (params.status === undefined ||
          (params.status === "paid" ? isPaid : !isPaid)) &&
        (params.name === undefined ||
          client.name.toLowerCase().includes(params.name.toLowerCase())) &&
        (params.email === undefined ||
          client.email.toLowerCase().includes(params.email.toLowerCase())) &&
        (params.city === undefined ||
          client.city.toLowerCase().includes(params.city.toLowerCase())) &&
        (params.cep === undefined || client.cep === params.cep) &&
        (params.cellphone === undefined ||
          client.cellphone === params.cellphone) &&
        (params.cpf === undefined || client.cpf === params.cpf)
      );
    });

    const start = (params.page - 1) * params.perPage;
    const clients = filtered
      .slice(start, start + params.perPage)
      .map((client) => {
        const isPaid = paidClientIds.has(client.id.toString());
        client.status = isPaid ? "paid" : "not-paid";
        return client;
      });

    return clients;
  }
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
