export interface Todo {
  userId: number;
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoPaginationResponse {
  data: Todo[];
  items: number;
  pages: number;
  first: number;
  last: number;
  next: number;
  prev: number;
}
