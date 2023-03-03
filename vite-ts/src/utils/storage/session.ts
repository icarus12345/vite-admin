import { decrypto, encrypto } from '../crypto';

class SessionStorageUtil {
  set(key: string, value: any): void {
    sessionStorage.setItem(key as string, encrypto(value));
  }
  get(key: string): any {
    const json = sessionStorage.getItem(key as string);
    let data: any = null;
    if (json) {
      try {
        data = decrypto(json);
      } catch {
      }
    }
    return data;
  }
  remove(key: string): void {
    window.sessionStorage.removeItem(key as string);
  }
  clear(): void {
    window.sessionStorage.clear();
  }
}

export const SessionStorage = new SessionStorageUtil()