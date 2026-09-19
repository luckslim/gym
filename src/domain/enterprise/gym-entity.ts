import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface GymProps {
  adminId: string;
  urlImage: string;
  street: string;
  state: string;
  number: number;
  city: string;
  cep: number;
}
export class Gym extends Entity<GymProps> {
  get adminId() {
    return this.props.adminId;
  }
  get urlImage() {
    return this.props.urlImage;
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
  get city() {
    return this.props.city;
  }
  get cep() {
    return this.props.cep;
  }

  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }
  set urlImage(urlImage: string) {
    this.props.urlImage = urlImage;
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
  set city(city: string) {
    this.props.city = city;
  }
  set cep(cep: number) {
    this.props.cep = cep;
  }
  static create(props: GymProps, id?: UniqueEntityID) {
    const gym = new Gym(props, id);
    return gym;
  }
}
