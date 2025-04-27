<template>
  <div>
    <h1>TanStack Query Demos</h1>

    <div>
      <NuxtLink v-for="demo in demos" :key="demo.path" :to="demo.path">
        <h2>{{ demo.title }}</h2>
        <p>{{ demo.description }}</p>
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
