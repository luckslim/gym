import type { Client } from "@/domain/enterprise/client-entity";

export interface FindClientsWithPaymentStatusParams {
  gymId: string;
  dateInitial: Date;
  dateFinal: Date;
  page: number;
  perPage: number;
  name?: string;
  email?: string;
  city?: string;
  cep?: number;
  cellphone?: number;
  cpf?: number;
  status?: "paid" | "not-paid";
}

export interface PaginatedClients {
  clients: Client[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
export interface clientRepository {
  create(client: Client): Promise<Client>;
  findByEmail(email: string): Promise<Client | null>;
  findByName(name: string): Promise<Client | null>;
  findById(id: string): Promise<Client | null>;
  save(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
  findClientsWithPaymentStatus(
    params: FindClientsWithPaymentStatusParams,
  ): Promise<Client[]>;
}
