// import type { App } from 'vue';
// import setupNetworkDirective from './network';
// import setupLoginDirective from './login';
// import setupPermissionDirective from './permission';

// /** setup custom vue directives. - [安装自定义的vue指令] */
// export function setupDirectives(app: App) {
//   setupNetworkDirective(app);
//   setupLoginDirective(app);
//   setupPermissionDirective(app);
// }
const focus = {
  mounted: (el) => el.focus()
}

// app.directive('demo', (el, binding) => {
//   console.log(binding.value.color) // => "white"
//   console.log(binding.value.text) // => "hello!"
// })

export default {
  directives: {
    // enables v-focus in template
    focus
  }
}
