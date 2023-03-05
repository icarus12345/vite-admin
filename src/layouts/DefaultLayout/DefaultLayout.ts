import { defineComponent } from 'vue'
import QuickSearch from '@/layouts/DefaultLayout/QuickSearch/QuickSearch.vue'
import Notification from '@/layouts/DefaultLayout/Notification/Notification.vue'
import AccountMenu from '@/layouts/DefaultLayout/AccountMenu/AccountMenu.vue'
import LeftNavbar from '@/layouts/DefaultLayout/LeftNavbar/LeftNavbar.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    QuickSearch,
    Notification,
    AccountMenu,
    LeftNavbar
  },
  setup() { },
  data() {
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
