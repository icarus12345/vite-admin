import TaskList from '@/modules/task/TaskList/TaskList.vue'
import { Crypto, LocalStorage, $Token } from '@/utils'
import { $TaskService, $Axios } from '@/services'
import { catchError, of } from 'rxjs'
import { Modal } from 'view-ui-plus';

export default {
  name: 'Home',
  components: {
    TaskList
  },
  setup() {
    LocalStorage.set('kkkk', {name: 'my name', scope: 1250})
    console.log(LocalStorage.get('kkkk'))

    console.log($Token, 'Token')
    console.log($TaskService, 'taskService')
    console.log($Axios, 'BackendAxiosInstance')
    $Axios.instance.get('https://jsonplaceholder.typicode.com/todos/1').pipe(
      catchError(() => {
        console.log('catchError')
        return of({data: 'Error -> Success'})
      })
    ).subscribe((res) => {
      console.log(res)
    })
  },
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    show() {
      console.log(typeof TaskList)
      this.$Modal.widget({
        title: 'Task List',
        component: TaskList,
        onCancel() {
          alert('Cancel')
        },
        // render(h) {
        //   return h(TaskList)
        // }
      })
    }
  }
}