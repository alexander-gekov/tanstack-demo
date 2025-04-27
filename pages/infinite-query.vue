<template>
  <div>
    <h1>Infinite Query Demo</h1>

    <div>
      <div v-auto-animate>
        <template v-if="data">
          <div v-for="(page, pageIndex) in data.pages" :key="pageIndex">
            <div
              v-for="todo in page.data"
              :key="todo.id"
              :ref="(el) => {
                if (todo === page.data[page.data.length - 1]) {
                  lastTodoRef = el as HTMLElement;
                }
              }"
              style="padding-top: 40px; padding-bottom: 40px">
              # {{ todo.id }}
              <input type="checkbox" v-model="todo.completed" />
              {{ todo.title }}:
              {{ todo.completed ? "Completed" : "Not Completed" }}
            </div>
          </div>
        </template>
      </div>

      <div v-if="isFetchingNextPage">
        <div>
          <div></div>
          Loading more...
        </div>
      </div>

      <div v-if="hasNextPage && !isFetchingNextPage">
        <button @click="() => fetchNextPage()">Load More</button>
      </div>

      <div v-if="!hasNextPage && data?.pages?.length">
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
