import { createApp, h, getCurrentInstance } from 'vue'
import { Modal } from 'view-ui-plus'
import WidgetModal from '@/components/WidgetModal/WidgetModal.vue'
const isClient = typeof window !== 'undefined'
import { i18n } from '@/locales/i18n';
import ViewUIPlus from 'view-ui-plus'
import store from '@/store'

Modal.widget = (props: any = {}) => {
  if (!isClient) return;
  const container = document.createElement('div');
  document.body.appendChild(container);

  const Instance = createApp({
    data() {
      return Object.assign({}, props, {

      });
    },
    render() {
      // render content
      let bodyRender: any;
      if (this.render) {
        bodyRender = this.render(h);
      } else if (this.component) {
        bodyRender = h(this.component, {
          onSelectionChange(items) {
            console.log(items,'ITEMS')
          }
        });
      } else {
        bodyRender = h('div', {
          innerHTML: this.body || '--'
        });
      }
      return h(
        WidgetModal,
        {
          ...props,
          // modelValue: this.visible,
          // 'onUpdate:modelValue': (status: boolean) => this.visible = status,
          onOpen() {
            console.log('OPEN')
          },
          onClose() {
            console.log('CLOSE')
          },
          onCancel: this.onCancel,
          onOk() {
            console.log('OK')
          },
          onSelectionChange(items) {
            console.log(items,'ITEMS')
          }
        },
        bodyRender
      );
    },
    computed: {

    },
    methods: {
      cancel() {
        if (this.closing) return;
        this.buttonLoading = false;
        this.onCancel();
        this.remove();
      },
      ok() {
        if (this.closing) return;
        if (this.loading) {
          this.buttonLoading = true;
        } else {
          this.remove();
        }
        this.onOk();
      },
      remove() {
        this.closing = true;
        setTimeout(() => {
          this.closing = false;
          this.destroy();
        }, 300);
      },
      destroy() {
        Instance.unmount();
        document.body.removeChild(container);
        this.onRemove();
      },
      onOk() { },
      onCancel() { },
      onRemove() { }
    },
    created() {
    }
  });
  Instance
    .use(store)
    .use(i18n)
    .use(ViewUIPlus, {
      i18n
    })
    .mount(container);
}

export default Modal;
