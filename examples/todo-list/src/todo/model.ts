import { Model, field, validation } from "mvvm-toolkit";

export type TodoDto = {
  id  : number;
  text: string;
  done: boolean;
};


export class TodoModel extends Model<TodoDto> {
  @field
	id: number = 0;

  @field
  @validation<TodoDto, string>((value) => (value?.trim() ? "" : "validation.required"))
  text: string = '';

  @field
	done = false;
}
