import { defineComponent } from 'vue'
export default defineComponent({
  name: 'QuickSearch',
  setup() { },
  data() {
    return {
      value4: '',
      data4: [
        {
          title: 'Layout',
          children: [
            {
              title: 'View UI',
              count: 10000,

            },
            {
              title: 'View UI Plus',
              count: 10600,

            }
          ]
        },
        {
          title: 'Components',
          children: [
            {
              title: 'View UI Plus 有多好',
              count: 60100,

            },
            {
              title: 'View UI Plus 是啥',
              count: 30010,

            }
          ]
        },
        {
          title: 'Form',
          children: [
            {
              title: 'View UI Plus 是一个设计语言',
              count: 100000,

            }
          ]
        }
      ]
    }
  }
})
