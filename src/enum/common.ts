export enum CONTENT_TYPE {
  JSON = 'application/json',
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data'
}

export enum DATA_TYPE {
  NUMBER = '[object Number]',
  STRING = '[object String]',
  BOOLEAN = '[object Boolean]',
  NULL = '[object Null]',
  UNDEFINED = '[object Undefined]',
  OBJECT = '[object Object]',
  ARRAY = '[object Array]',
  FUNCTION = '[object Function]',
  DATE = '[object Date]',
  REGEXP = '[object RegExp]',
  PROMISE = '[object Promise]',
  SET = '[object Set]',
  MAP = '[object Map]',
  FILE = '[object File]'
}
