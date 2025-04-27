<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">TanStack Query Demos</h1>

    <button @click="clearCache">Clear and Garbage Collection</button>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="demo in demos"
        :key="demo.path"
        :to="demo.path"
        class="block p-6 border rounded-lg hover:border-blue-500 transition-colors">
        <h2 class="text-xl font-semibold mb-2">{{ demo.title }}</h2>
        <p class="text-gray-600">{{ demo.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const demos = [
  {
    path: "/basic",
    title: "Basic",
    description: "Learn how to use TanStack Query with a basic example.",
  },
  {
    path: "/prefetching",
    title: "Prefetching",
    description:
      "Learn how to prefetch data before navigation to improve user experience.",
  },
  {
    path: "/deduping",
    title: "Request Deduping",
    description:
      "See how TanStack Query automatically dedupes multiple requests for the same data.",
  },
  {
    path: "/optimistic-updates",
    title: "Optimistic Updates",
    description:
      "Implement optimistic updates to make your UI feel more responsive.",
  },
  {
    path: "/polling",
    title: "Polling",
    description:
      "Learn how to automatically refetch data at intervals to keep it fresh.",
  },
  {
    path: "/pagination",
    title: "Pagination",
    description:
      "Implement pagination with TanStack Query for better data handling.",
  },
  {
    path: "/infinite-query",
    title: "Infinite Query",
    description: "Build infinite scrolling functionality with TanStack Query.",
  },
];

const clearCache = () => {
  queryClient.clear();
  queryClient.resetQueries();
  console.log("Cache cleared");
};
</script>
