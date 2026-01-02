import { TodoModel } from "./model";

export type TodoId = TodoModel['id'];

export type Todo = TodoModel;

export type TodoFilterType = `${TodoFilter}`;

export const enum TodoFilter {
	All    = 'all',
	Active = 'active',
	Done   = 'done',
}