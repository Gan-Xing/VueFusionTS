<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="increment">Click me: {{ count }}</button>
  </div>
</template>

<script lang="ts">
import { ref, computed } from '@vue/composition-api';
import { Component } from 'vue';

export default {
  name: 'App',
  setup() {
    const count = ref(0);
    const message = computed(() => `Hello Vite Vue2 with Composition API!`);

    const increment = () => {
      count.value++;
    };

    return {
      count,
      message,
      increment
    };
  }
} as Component;
</script>
