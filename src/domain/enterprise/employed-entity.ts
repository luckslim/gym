import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface EmployedProps {
  gymId: string;
  urlImage: string;
  name: string;
  email: string;
  password: string;
  city: string;
  cep: number;
  cellphone: number;
  cpf: number;
}
export class Employed extends Entity<EmployedProps> {
  get gymId() {
    return this.props.gymId;
  }

  get name() {
    return this.props.name;
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
  static create(props: EmployedProps, id?: UniqueEntityID) {
    const employed = new Employed(props, id);
    return employed;
  }
}
