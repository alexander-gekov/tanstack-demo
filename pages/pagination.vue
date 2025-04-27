<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Pagination Demo</h1>

    <div class="max-w-4xl">
      <div
        v-if="!isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div v-for="todo in todos?.data" :key="todo.id" class="flex gap-2">
          # {{ todo.id }}
          <input type="checkbox" v-model="todo.completed" />
          {{ todo.title }}: {{ todo.completed ? "Completed" : "Not Completed" }}
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-4">Loading...</div>

      <div class="flex justify-center items-center space-x-2">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-4 py-2 border rounded"
          :class="
            page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          ">
          Previous
        </button>
        <span class="text-gray-600">Page {{ page }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-4 py-2 border rounded"
          :class="
            page === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-100'
          ">
          Next
        </button>
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
