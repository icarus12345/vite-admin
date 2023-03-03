import Demo from '@/components/Demo'
import { Crypto, LocalStorage, $Token } from '@/utils'
import { $TaskService, $Axios } from '@/services'
import { catchError, of } from 'rxjs'

export default {
  name: 'Home',
  components: {
    Demo
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
  methods: {
  }
}