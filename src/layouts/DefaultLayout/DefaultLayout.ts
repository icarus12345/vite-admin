import { defineComponent } from 'vue'
import { $Token } from '@/utils'
export default defineComponent({
  name: 'DefaultLayout',
  setup() { },
  data() {
    console.log($Token)
    return {
      split: 0.5,
      activeRoute: this.$route.path,
      breadcrumbList: [
        {
          title: 'Home',
          to: '/'
        },
        {
          title: 'Auth',
          to: '/'
        },
        {
          title: 'Current'
        }
      ],
      tabList: [
        {
          label: 'Document',
          name: 'doc'
        },
        {
          label: 'Usage',
          name: 'usage'
        },
        {
          label: 'Manual',
          name: 'code'
        }
      ],
      copyright: 'Copyright © 2023 View Design All Rights Reserved'
    }
  }
})
