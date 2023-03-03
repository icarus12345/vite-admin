import { usePermission } from '@/composables'

export default function setupPermissionDirective(app) {
  const { hasPermission } = usePermission();

  function updateElVisible(el, permission) {
    if (!permission) {
      throw new Error(`need roles: like v-permission="'admin'", v-permission="['admin', 'test]"`)
    }
    if (!hasPermission(permission)) {
      el.parentElement?.removeChild(el);
    }
  }

  const permissionDirective = {
    mounted(el, binding) {
      updateElVisible(el, binding.value)
    },
    beforeUpdate(el, binding) {
      updateElVisible(el, binding.value)
    }
  }

  app.directive('permission', permissionDirective)
}