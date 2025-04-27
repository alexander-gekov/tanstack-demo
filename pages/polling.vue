<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Polling Demo</h1>

    <div class="max-w-md">
      <div class="mb-4 flex items-center space-x-4">
        <button
          @click="togglePolling"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          :class="{ 'bg-red-500 hover:bg-red-600': isPolling }">
          {{ isPolling ? "Stop Polling" : "Start Polling" }}
        </button>
        <span class="text-sm text-gray-600">
          Last updated: {{ lastUpdated }}
        </span>
      </div>

      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-2">Current Bitcoin Price</h2>
        <div v-if="isLoading" class="text-gray-600">Loading...</div>
        <div v-else class="text-3xl font-bold">
          ${{ price?.toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PriceData {
  bitcoin: {
    usd: number;
  };
}

const isPolling = ref(false);
const lastUpdated = ref(new Date().toLocaleTimeString());

const { data: priceData, isLoading } = useQuery({
  queryKey: ["bitcoin-price"],
  queryFn: () =>
    $fetch<PriceData>(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    ),
  refetchInterval: computed(() => (isPolling.value ? 5000 : false)),
});

const price = computed(() => priceData.value?.bitcoin.usd);

watch(priceData, () => {
  lastUpdated.value = new Date().toLocaleTimeString();
});

const togglePolling = () => {
  isPolling.value = !isPolling.value;
};
</script>
