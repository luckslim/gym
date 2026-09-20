import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface CreatorProps {
  userName: string;
  password: string;
}
export class Creator extends Entity<CreatorProps> {
  get userName() {
    return this.props.userName;
  }
  get password() {
    return this.props.password;
  }

  set userName(userName: string) {
    this.props.userName = userName;
  }
  set password(password: string) {
    this.props.password = password;
  }

  static create(props: CreatorProps, id?: UniqueEntityID) {
    const creator = new Creator(props, id);
    return creator;
  }
}
