class _TokenUtil {
  constructor() {}
  tokenKey: string = 'vue_admin_template_token'
  get(): string | null {
    return localStorage.getItem(this.tokenKey)
  }
  set(token: string): void {
    return localStorage.setItem(this.tokenKey, token)
  }
  remove(): void {
    return localStorage.removeItem(this.tokenKey)
  }
}
export const Token = new _TokenUtil()
