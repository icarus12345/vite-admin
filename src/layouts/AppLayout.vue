<template>
  <component :is="layout"> <router-view /> </component>
</template>

<script >
// path: src/layouts/TheAppLayout.vue
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout.vue'

export default defineComponent({
  components: { DefaultLayout },
  name: 'TheAppLayout',
  setup() {
    const route = useRoute()
    /**
     *  This is a computed property that will return the name
     *  of the current route
     */
    const layout = computed(() => {
      const metaLayout = route?.meta?.layout
      if (metaLayout) {
        return `${metaLayout}`
      }
      return 'div'
    })
    return {
      layout,
    }
  },
})
</script>
