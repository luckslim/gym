import { Entity } from "@/core/entity/entity";
import type { UniqueEntityID } from "@/core/entity/unique-entityId";

export interface ExerciseProps {
  exerciseName: string;
  exerciseUrl: string;
}
export class Exercise extends Entity<ExerciseProps> {
  get exerciseName() {
    return this.props.exerciseName;
  }
  get exerciseUrl() {
    return this.props.exerciseUrl;
  }
  
  set exerciseName(exerciseName: string) {
    this.props.exerciseName = exerciseName;
  }
  set exerciseUrl(exerciseUrl: string) {
    this.props.exerciseUrl = exerciseUrl;
  }

  static create(props: ExerciseProps, id?: UniqueEntityID) {
    const exercise = new Exercise(props, id);
    return exercise;
  }
}
