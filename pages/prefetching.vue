<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Prefetching Demo</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="todo in todos" :key="todo.id" class="border p-4 rounded-lg">
        <NuxtLink
          @mouseenter="prefetchTodo(todo.id)"
          :to="`/todo/${todo.id}`"
          class="text-blue-500 hover:underline">
          Todo {{ todo.id }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const { todos } = useTodosQuery();

const prefetchTodo = (todoId: string) => {
  queryClient.prefetchQuery({
    queryKey: ["todo", todoId],
    queryFn: () =>
      fetch(`http://localhost:3000/todos/${todoId}`).then((res) => res.json()),
  });
};
</script>
