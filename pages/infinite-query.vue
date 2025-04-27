<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Infinite Query Demo</h1>

    <div class="max-w-2xl">
      <div class="space-y-4 h-screen overflow-y-auto" v-auto-animate>
        <template v-if="data">
          <div
            v-for="(page, pageIndex) in data.pages"
            :key="pageIndex"
            class="h-screen">
            <div
              v-for="todo in page.data"
              :key="todo.id"
              class="border rounded-lg p-4 space-y-40 h-40"
              :ref="(el) => {
                if (todo === page.data[page.data.length - 1]) {
                  lastTodoRef = el as HTMLElement;
                }
              }">
              # {{ todo.id }}
              <input type="checkbox" v-model="todo.completed" />
              {{ todo.title }}:
              {{ todo.completed ? "Completed" : "Not Completed" }}
            </div>
          </div>
        </template>
      </div>

      <div v-if="isFetchingNextPage" class="text-center py-4">
        <div class="inline-flex items-center">
          <div
            class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading more...
        </div>
      </div>

      <div v-if="hasNextPage && !isFetchingNextPage" class="text-center py-4">
        <button
          @click="() => fetchNextPage()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Load More
        </button>
      </div>

      <div
        v-if="!hasNextPage && data?.pages?.length"
        class="text-center py-4 text-gray-600">
        No more todos to load
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInfiniteQuery } from "@tanstack/vue-query";
import type { TodoPaginationResponse } from "~/types";

const lastTodoRef = ref<HTMLElement>();

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  useInfiniteQuery<TodoPaginationResponse>({
    queryKey: ["todos"],
    queryFn: async ({ pageParam }) => {
      return await $fetch<TodoPaginationResponse>("/api/todos", {
        query: {
          page: pageParam,
        },
      });
    },
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.prev ?? undefined,
    initialPageParam: 1,
  });

// Implement intersection observer for auto-loading
const observer = ref<IntersectionObserver>();

onMounted(() => {
  observer.value = new IntersectionObserver(
    ([entry]) => {
      if (
        entry?.isIntersecting &&
        hasNextPage.value &&
        !isFetchingNextPage.value
      ) {
        fetchNextPage();
      }
    },
    { threshold: 0.8 }
  );

  if (lastTodoRef.value) {
    observer.value.observe(lastTodoRef.value);
  }
});

onUnmounted(() => {
  observer.value?.disconnect();
});

watch(lastTodoRef, (el) => {
  if (!el || !observer.value) return;

  observer.value.disconnect();
  observer.value.observe(el);
});
</script>
