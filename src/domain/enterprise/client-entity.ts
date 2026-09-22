import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface ClientProps {
  gymId: string;
  urlImage: string;
  status: string;
  name: string;
  email: string;
  password: string;
  city: string;
  cep: number;
  cellphone: number;
  cpf: number;
  dateOfCreation: Date;
}
export class Client extends Entity<ClientProps> {
  get gymId() {
    return this.props.gymId;
  }
  get name() {
    return this.props.name;
  }
  get status() {
    return this.props.status;
  }
  get dateOfCreation() {
    return this.props.dateOfCreation;
  }

  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }
  get urlImage() {
    return this.props.urlImage;
  }
  get city() {
    return this.props.city;
  }
  get cep() {
    return this.props.cep;
  }
  get cellphone() {
    return this.props.cellphone;
  }
  get cpf() {
    return this.props.cpf;
  }

  set name(name: string) {
    this.props.name = name;
  }
  set dateOfCreation(dateOfCreation: Date) {
    this.props.dateOfCreation = dateOfCreation;
  }
  set status(status: string) {
    this.props.status = status;
  }
  set email(email: string) {
    this.props.email = email;
  }
  set password(password: string) {
    this.props.password = password;
  }
  set urlImage(urlImage: string) {
    this.props.urlImage = urlImage;
  }
  set city(city: string) {
    this.props.city = city;
  }
  set cep(cep: number) {
    this.props.cep = cep;
  }
  set cellphone(cellphone: number) {
    this.props.cellphone = cellphone;
  }
  set cpf(cpf: number) {
    this.props.cpf = cpf;
  }

  static create(props: ClientProps, id?: UniqueEntityID) {
    const client = new Client(props, id);
    return client;
  }
}
