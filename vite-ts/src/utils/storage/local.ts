import { decrypto, encrypto } from '../crypto';
interface StorageData {
  value: any;
  expire: number | null;
}
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;
class LocalStorageUtil {

  set(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME): void {
    const storageData: StorageData = {
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null
    };
    const json = encrypto(storageData);
    window.localStorage.setItem(key as string, json);
  }

  get(key: string): StorageData | null {
    const json = window.localStorage.getItem(key as string);
    if (json) {
      let storageData: StorageData | null = null;
      try {
        storageData = decrypto(json);
      } catch {
        // 防止解析失败
      }
      if (storageData) {
        const { value, expire } = storageData;
        // 在有效期内直接返回
        if (expire === null || expire >= Date.now()) {
          return value;
        }
      }
      this.remove(key);
      return null;
    }
    return null;
  }

  remove(key: string): void {
    window.localStorage.removeItem(key as string);
  }

  clear(): void {
    window.localStorage.clear();
  }
}

export const LocalStorage = new LocalStorageUtil();