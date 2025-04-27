<template>
  <div>
    <h1>Prefetching Demo</h1>
    <div>
      <div v-for="todo in todos" :key="todo.id">
        <NuxtLink @mouseenter="prefetchTodo(todo.id)" :to="`/todo/${todo.id}`">
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
