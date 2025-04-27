<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold mb-4">Optimistic Updates Demo</h1>
    <div>
      <input type="text" v-model="newTodo" />
      <button @click="handleCreateTodo">Create Todo</button>
    </div>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <div>
      <div
        v-if="
          createTodoMutation.isPending.value &&
          createTodoMutation.variables.value
        ">
        # {{ createTodoMutation.variables.value?.id }}
        <input type="checkbox" disabled />
        {{ createTodoMutation.variables.value?.title }}:
        {{
          createTodoMutation.variables.value?.completed
            ? "Completed"
            : "Not Completed"
        }}
        <button disabled>Delete</button>
      </div>
      <div v-for="todo in todos" :key="todo.id" class="flex gap-2">
        # {{ todo.id }}
        <input type="checkbox" v-model="todo.completed" />
        {{ todo.title }}: {{ todo.completed ? "Completed" : "Not Completed" }}
        <button @click="handleDeleteTodo(todo.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodosQuery } from "~/composables/useTodosQuery";

const {
  todos,
  isPending,
  createTodoMutation,
  isError,
  error,
  createTodo,
  deleteTodo,
} = useTodosQuery();

const newTodo = ref("");

const handleCreateTodo = async () => {
  await createTodo({ title: newTodo.value, completed: false });
  newTodo.value = "";
};

const handleDeleteTodo = async (todoId: string) => {
  await deleteTodo(todoId);
};
</script>
