import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface PaymentHistoryProps {
  date: Date;
  userId: string;
  adminId: string;
  price: number;
  methods: string;
}
export class PaymentHistory extends Entity<PaymentHistoryProps> {
  get date() {
    return this.props.date;
  }
  get adminId() {
    return this.props.adminId;
  }
  get userId() {
    return this.props.userId;
  }
  get price() {
    return this.props.price;
  }
  get methods() {
    return this.props.methods;
  }

  set date(date: Date) {
    this.props.date = date;
  }
  set price(price: number) {
    this.props.price = price;
  }
  set adminId(adminId: string) {
    this.props.adminId = adminId;
  }
  set methods(methods: string) {
    this.props.methods = methods;
  }
  set userId(userId: string) {
    this.props.userId = userId;
  }

  static create(props: PaymentHistoryProps, id?: UniqueEntityID) {
    const paymenthistory = new PaymentHistory(props, id);
    return paymenthistory;
  }
}
