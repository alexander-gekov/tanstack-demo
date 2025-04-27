<template>
  <div class="flex flex-col gap-4">
    <div>
      <input type="text" v-model="newTodo" />
      <button @click="handleCreateTodo">Create Todo</button>
    </div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <div v-else>
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

const { todos, isLoading, isPending, isError, error, createTodo, deleteTodo } =
  useTodosQuery();

const newTodo = ref("");

const handleCreateTodo = async () => {
  await createTodo({ title: newTodo.value, completed: false });
  newTodo.value = "";
};

const handleDeleteTodo = async (todoId: string) => {
  await deleteTodo(todoId);
};
</script>
