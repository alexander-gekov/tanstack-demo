<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Infinite Query Demo</h1>

    <div class="max-w-2xl">
      <div class="space-y-4" v-auto-animate>
        <div v-for="page in data?.pages ?? []" :key="page.nextId">
          <div
            v-for="comment in page.comments"
            :key="comment.id"
            class="border rounded-lg p-4">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {{ comment.email[0].toUpperCase() }}
                </div>
              </div>
              <div>
                <div class="font-medium">{{ comment.email }}</div>
                <p class="text-gray-600 mt-1">{{ comment.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isFetchingNextPage" class="text-center py-4">
        Loading more...
      </div>

      <div v-if="hasNextPage && !isFetchingNextPage" class="text-center py-4">
        <button
          @click="fetchNextPage"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Load More
        </button>
      </div>

      <div v-if="!hasNextPage" class="text-center py-4 text-gray-600">
        No more comments to load
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Comment {
  id: number;
  email: string;
  body: string;
}

interface CommentsResponse {
  comments: Comment[];
  nextId: number | null;
}

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: ({ pageParam = 0 }) =>
      $fetch<CommentsResponse>(
        `https://api.example.com/comments?cursor=${pageParam}`
      ),
    getNextPageParam: (lastPage) => lastPage.nextId,
  });

// Optional: Implement intersection observer for auto-loading
const observer = ref<IntersectionObserver>();
const lastCommentRef = ref<HTMLElement>();

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
    { threshold: 0.5 }
  );
});

onUnmounted(() => {
  observer.value?.disconnect();
});

watch(lastCommentRef, (el) => {
  if (el) {
    observer.value?.observe(el);
  }
});
</script>
