export default {
  data() {
    return {
      remember: true
    }
  },
  methods: {
    handleSubmit(valid, { username, password }) {
      if (valid) {
        this.$Modal.info({
          title: '输入的内容如下：',
          content: 'username: ' + username + ' | password: ' + password
        })
      }
    }
  }
}
