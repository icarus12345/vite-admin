<template>
  <AppLayout/>
</template>

<script>
import { defineComponent } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppLayout,
  }
})
</script>
