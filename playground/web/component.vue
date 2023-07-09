<script setup lang="ts">
import { useStore } from '@savitri/web'

const petStore = useStore('pet')
</script>

<template>
  <div>
    <div
      v-for="item in petStore.items"
      :key="`${item._id}`"
    >
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>
