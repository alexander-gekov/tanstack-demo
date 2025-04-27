<template>
  <div>
    <h1>Component Two</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="todo in todos?.slice(0, 3)" :key="todo.id">
          {{ todo.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { todos, isLoading } = useTodosQuery();
</script>

<style></style>
