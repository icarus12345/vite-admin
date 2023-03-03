export default function usePermission() {
  const auth = useAuthStore()

  function hasPermission(permission) {
    const { userRole } = auth.userInfo

    let has = userRole === 'super'
    if (!has) {
      if (isArray(permission)) {
        has = permission.includes(userRole)
      }
      if (isString(permission)) {
        has = permission === userRole
      }
    }
    return has
  }

  return {
    hasPermission
  }
}
