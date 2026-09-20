import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface AdminProps {
  gymId: string;
  urlImage: string;
  name: string;
  email: string;
  password: string;
  city: string;
  cep: number;
  street: string;
  state: string;
  number: number;
  cellphone: number;
  cpf: number;
}
export class Admin extends Entity<AdminProps> {
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
  get street() {
    return this.props.street;
  }
  get state() {
    return this.props.state;
  }
  get number() {
    return this.props.number;
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
  set street(street: string) {
    this.props.street = street;
  }
  set state(state: string) {
    this.props.state = state;
  }
  set number(number: number) {
    this.props.number = number;
  }
  set cellphone(cellphone: number) {
    this.props.cellphone = cellphone;
  }
  set gymId(gymId: string) {
    this.props.gymId = gymId;
  }
  set cpf(cpf: number) {
    this.props.cpf = cpf;
  }
  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id);
    return admin;
  }
}
