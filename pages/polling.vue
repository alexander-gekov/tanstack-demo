<template>
  <div>
    <h1>Polling Demo</h1>

    <div>
      <div>
        <button @click="togglePolling">
          {{ isPolling ? "Stop Polling" : "Start Polling" }}
        </button>
      </div>

      <div>
        <h2>Current Bitcoin Price</h2>
        <div v-if="isLoading">Loading...</div>
        <div v-else>${{ price?.toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

interface PriceData {
  bitcoin: {
    usd: number;
  };
}

const isPolling = ref(false);

const { data: priceData, isLoading } = useQuery({
  queryKey: ["bitcoin-price"],
  queryFn: () =>
    $fetch<PriceData>(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    ),
  refetchInterval: computed(() => (isPolling.value ? 5000 : false)),
  refetchIntervalInBackground: true,
  retry: 3,
  refetchOnWindowFocus: true,
});

const price = computed(() => priceData.value?.bitcoin.usd);

const togglePolling = () => {
  isPolling.value = !isPolling.value;
};
</script>
