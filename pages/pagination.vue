<template>
  <div>
    <h1>Pagination Demo</h1>

    <div>
      <div v-if="!isLoading">
        <div v-for="todo in todos?.data" :key="todo.id">
          # {{ todo.id }}
          <input type="checkbox" v-model="todo.completed" />
          {{ todo.title }}: {{ todo.completed ? "Completed" : "Not Completed" }}
        </div>
      </div>

      <div v-if="isLoading">Loading...</div>

      <div>
        <button @click="prevPage" :disabled="page === 1">Previous</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { Todo, TodoPaginationResponse } from "~/types";

const page = ref(1);

const { data: todos, isLoading } = useQuery({
  queryKey: ["todos", page],
  queryFn: () =>
    $fetch<TodoPaginationResponse>(`/api/todos`, {
      query: {
        page: page.value,
      },
    }),
});

const totalPages = computed(() => todos.value?.pages ?? 1);

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
  }
};
</script>
