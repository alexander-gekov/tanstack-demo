<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Optimistic Updates Demo</h1>

    <div class="max-w-md">
      <div class="mb-4">
        <input
          v-model="newTodo"
          type="text"
          class="w-full px-4 py-2 border rounded"
          placeholder="Add a new todo"
          @keyup.enter="addTodo" />
      </div>

      <div class="space-y-2">
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="flex items-center justify-between p-3 border rounded"
          :class="{ 'opacity-50': todo.isOptimistic }">
          <span>{{ todo.text }}</span>
          <button
            @click="deleteTodo(todo.id)"
            class="text-red-500 hover:text-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Todo {
  id: number;
  text: string;
  isOptimistic?: boolean;
}

const newTodo = ref("");
const queryClient = useQueryClient();

const { data: todos } = useQuery({
  queryKey: ["todos"],
  queryFn: () => $fetch<Todo[]>("https://api.example.com/todos"),
});

const addTodoMutation = useMutation({
  mutationFn: (text: string) =>
    $fetch("https://api.example.com/todos", {
      method: "POST",
      body: { text },
    }),
  onMutate: async (newTodoText) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["todos"] });

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(["todos"]);

    // Optimistically update the UI
    const optimisticTodo = {
      id: Date.now(),
      text: newTodoText,
      isOptimistic: true,
    };

    queryClient.setQueryData(["todos"], (old: Todo[] = []) => [
      ...old,
      optimisticTodo,
    ]);

    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    // Rollback on error
    queryClient.setQueryData(["todos"], context?.previousTodos);
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});

const deleteTodoMutation = useMutation({
  mutationFn: (id: number) =>
    $fetch(`https://api.example.com/todos/${id}`, {
      method: "DELETE",
    }),
  onMutate: async (todoId) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const previousTodos = queryClient.getQueryData(["todos"]);

    queryClient.setQueryData(["todos"], (old: Todo[] = []) =>
      old.filter((todo) => todo.id !== todoId)
    );

    return { previousTodos };
  },
  onError: (err, todoId, context) => {
    queryClient.setQueryData(["todos"], context?.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});

const addTodo = () => {
  if (!newTodo.value.trim()) return;
  addTodoMutation.mutate(newTodo.value);
  newTodo.value = "";
};

const deleteTodo = (id: number) => {
  deleteTodoMutation.mutate(id);
};
</script>
