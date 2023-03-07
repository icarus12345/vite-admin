export default {
  name: 'WidgetModal',
  components: {
  },
  props: {
    title: String,
    selectedIds: [String],
    selectedItems: Array
  },
  emits: ['selectionChange', 'open', 'close', 'cancel', 'ok', 'back'],
  setup(props: any) {
    console.log(props, 'props')
    return {
    }
  },
  data() {
    return {
      show: true
    }
  },
  created() {
    this.$emit('open')
  },
  methods: {
    onVisibleChange() {
      console.log('onVisibleChange')
    },
    onOk() {
      this.$emit('oK')
    },
    onBack() {
      this.$emit('back')
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
}