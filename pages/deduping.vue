<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Request Deduping Demo</h1>
    <div class="space-y-4">
      <div
        v-for="component in 3"
        :key="component"
        class="border p-4 rounded-lg">
        <PostComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const PostComponent = defineComponent({
  setup() {
    const { data, isLoading } = useQuery({
      queryKey: ["dedupedPost"],
      queryFn: () => $fetch("https://jsonplaceholder.typicode.com/posts/1"),
    });

    return {
      data,
      isLoading,
    };
  },
  template: `
    <div>
      <p v-if="isLoading">Loading...</p>
      <div v-else>
        <h2 class="text-lg font-semibold">{{ data.title }}</h2>
        <p class="mt-2">{{ data.body }}</p>
      </div>
    </div>
  `,
});
</script>
