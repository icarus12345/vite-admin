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
      show: true,
      fullscreen: false,
      
    }
  },
  created() {
    this.$emit('open');
  },
  mounted () {
  },
  methods: {
    onVisibleChange() {
      this.$emit('close')
    },
    onOk() {
      this.$emit('ok')
    },
    onBack() {
      this.$emit('back')
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
}