<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Pagination Demo</h1>

    <div class="max-w-4xl">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div v-for="post in posts" :key="post.id" class="border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-2 line-clamp-1">
            {{ post.title }}
          </h2>
          <p class="text-gray-600 line-clamp-3">{{ post.body }}</p>
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
interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostResponse {
  data: Post[];
  total: number;
  per_page: number;
}

const page = ref(1);
const perPage = 9;

const { data, isLoading } = useQuery({
  queryKey: ["posts", page],
  queryFn: () =>
    $fetch<PostResponse>(
      `https://api.example.com/posts?page=${page.value}&per_page=${perPage}`
    ),
});

const posts = computed(() => data.value?.data ?? []);
const totalPages = computed(() =>
  Math.ceil((data.value?.total ?? 0) / perPage)
);

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
