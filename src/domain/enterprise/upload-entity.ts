import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface UploadProps {
  userId: string;
  fileName: string;
  body: Buffer | null;
  mimeType?: string | null;
}

export class Upload extends Entity<UploadProps> {
  get userId() {
    return this.props.userId;
  }

  get fileName() {
    return this.props.fileName;
  }

  get body() {
    return this.props.body;
  }

  get mimeType() {
    return this.props.mimeType;
  }

  set fileName(fileName: string) {
    this.props.fileName = fileName;
  }

  static create(props: UploadProps, id?: UniqueEntityID) {
    const upload = new Upload(props, id);
    return upload;
  }
}
