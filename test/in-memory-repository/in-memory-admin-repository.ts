import type { adminRepository } from "@/domain/aplication/repository/admin-repository";
import type { Admin } from "@/domain/enterprise/admin-entity";

export class InMemoryAdminRepository implements adminRepository {
  public items: Admin[] = [];

  async create(admin: Admin): Promise<Admin> {
    this.items.push(admin);
    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.items.find((admin) => admin.email === email) ?? null;
  }

  async findByAdminName(adminName: string): Promise<Admin | null> {
    return this.items.find((admin) => admin.name === adminName) ?? null;
  }

  async findById(id: string): Promise<Admin | null> {
    return this.items.find((admin) => admin.id.toString() === id) ?? null;
  }

  async findManyByAdminIds(ids: string[]): Promise<Admin[] | null> {
    return this.items.filter((admin) => ids.includes(admin.id.toString()));
  }

  async save(admin: Admin): Promise<Admin> {
    const index = this.items.findIndex((item) => item.id === admin.id);
    if (index === -1) this.items.push(admin);
    else this.items[index] = admin;
    return admin;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((admin) => admin.id.toString() !== id);
  }
}
