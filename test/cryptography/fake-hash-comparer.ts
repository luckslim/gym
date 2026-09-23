import type { HashComparer } from "@/domain/aplication/cryptography/hash-comparer";

export class FakeHashComparer implements HashComparer {
  async comparer(plain: string, hash: string): Promise<boolean> {
    return `hashed-${plain}` === hash;
  }
}
