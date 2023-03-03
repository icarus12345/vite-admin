// import { App } from 'vue';
// import { ModuleNamespace } from 'vite/types/hot';

/**
 * Register layouts in the app instance
 *
 * @param {App<Element>} app
 */
export default function registerLayouts(app) {
  const layouts = import.meta.globEager('./*.vue')

  Object.entries(layouts).forEach(([, layout]) => {
    app.component(layout?.default?.name, layout?.default)
  })
}
