<template>
  <div>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">Error loading todo</div>
    <div v-else class="todo-details">
      <h1>Todo #{{ todo?.id }}</h1>

      <div>User ID: {{ todo?.userId }}</div>
      <div>Created: {{ todo?.createdAt }}</div>

      <NuxtLink to="/prefetching">Back to List</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import type { Todo } from "~/types";

const { id } = useRoute().params;

const {
  data: todo,
  isPending,
  isError,
} = useQuery({
  queryKey: ["todo", id],
  queryFn: () => $fetch<Todo>(`/api/todos/${id}`),
});
</script>

<style></style>
