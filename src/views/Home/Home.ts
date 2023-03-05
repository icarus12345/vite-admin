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
      // const instance = Modal.newInstance({
      //   closable: false,
      //   maskClosable: false,
      //   footerHide: true,
      //   // render: render,
      //   lockScroll: true,
      //   visible: false,
      //   width: 416,
      //   title: '',
      //   body: '',
      //   iconType: '',
      //   iconName: '',
      //   okText: undefined,
      //   cancelText: undefined,
      //   showCancel: false,
      //   loading: false,
      //   buttonLoading: false,
      //   scrollable: false,
      //   closing: false 
      // });
      // instance.show({
      //   onRemove() {

      //   }
      // })
      this.$Modal.alert({})
      // console.log(instance,this.$Modal)
      
      // this.$Modal.confirm({
      //   icon: null,
      //   title: 'AAA',
      //   render: (h) => {
      //       return h( Input, {
      //           size: "large",
      //           modelValue: this.value,
      //           autofocus: true,
      //           placeholder: 'Please enter your name...',
      //           'onInput': (event) => {
      //               this.value = event.target.value;
      //           }
      //       })
      //   }
      // })
    }
  }
}