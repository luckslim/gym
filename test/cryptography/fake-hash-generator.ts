import type { HashGenerator } from "@/domain/aplication/cryptography/hash-generator";

export class FakeHashGenerator implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return `hashed-${plain}`;
  }
}
