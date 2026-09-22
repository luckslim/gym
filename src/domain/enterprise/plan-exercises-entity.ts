import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface PlanProps {
  userId: string;
  planName: string;
  exerciseIds: string[];
}
export class Plan extends Entity<PlanProps> {
  get userId() {
    return this.props.userId;
  }

  get planName() {
    return this.props.planName;
  }

  get exerciseIds() {
    return this.props.exerciseIds;
  }

  set planName(planName: string) {
    this.props.planName = planName;
  }

  set exerciseIds(exerciseIds: string[]) {
    this.props.exerciseIds = exerciseIds;
  }
  static create(props: PlanProps, id?: UniqueEntityID) {
    const plan = new Plan(props, id);
    return plan;
  }
}
