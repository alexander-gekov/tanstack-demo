import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Todo } from "~/types";

export const useTodosQuery = () => {
  const queryClient = useQueryClient();

  const fetchTodos = async (): Promise<Todo[]> => {
    const data = await $fetch<Todo[]>("/api/todos", {
      method: "GET",
    });
    return data || [];
  };

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 1000 * 1,
  });

  const createTodoMutation = useMutation({
    mutationFn: async (todoData: Partial<Todo>) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    mutationKey: ["deleteTodo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    ...todosQuery,
    todos: todosQuery.data,
    createTodoMutation,
    deleteTodoMutation,
    createTodo: createTodoMutation.mutateAsync,
    deleteTodo: deleteTodoMutation.mutateAsync,
  };
};
