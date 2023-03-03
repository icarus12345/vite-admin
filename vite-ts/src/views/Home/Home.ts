import Demo from '@/components/Demo'
import { Crypto, LocalStorage, Token } from '@/utils'
import { taskService } from '@/services'

export default {
  name: 'Home',
  components: {
    Demo
  },
  setup() {
    LocalStorage.set('kkkk', {name: 'my name', scope: 1250})
    console.log(LocalStorage.get('kkkk'))

    console.log(Token, 'Token')
    console.log(taskService, 'Token')
  },
  methods: {
  }
}