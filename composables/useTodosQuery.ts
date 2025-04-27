import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Todo } from "~/types";

export const useTodosQuery = () => {
  const queryClient = useQueryClient();

  const fetchTodos = async (): Promise<Todo[]> => {
    const data = await $fetch<Todo[]>("/api/todos", {
      method: "GET",
    });
    console.log("fetchTodos");
    return data || [];
  };

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const createTodoMutation = useMutation({
    mutationFn: async (todoData: Partial<Todo>) => {
      return await $fetch<Todo>("/api/todos", {
        method: "POST",
        body: todoData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: string) => {
      return await $fetch<Todo>("/api/todos", {
        method: "DELETE",
        body: { id: todoId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    ...todosQuery,
    todos: todosQuery.data,
    createTodo: createTodoMutation.mutateAsync,
    deleteTodo: deleteTodoMutation.mutateAsync,
  };
};
