import { DATA_TYPE } from '@/enum';

export function isNumber<T extends number>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.NUMBER;
}

export function isString<T extends string>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.STRING;
}

export function isBoolean<T extends boolean>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.BOOLEAN;
}

export function isNull<T extends null>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.NULL;
}

export function isUndefined<T extends undefined>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.UNDEFINED;
}

export function isObject<T extends Record<string, any>>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.OBJECT;
}

export function isArray<T extends any[]>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.ARRAY;
}

export function isFunction<T extends (...args: any[]) => any | void | never>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.FUNCTION;
}

export function isDate<T extends Date>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.DATE;
}

export function isRegExp<T extends RegExp>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.REGEXP;
}

export function isPromise<T extends Promise<any>>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.PROMISE;
}

export function isSet<T extends Set<any>>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.SET;
}

export function isMap<T extends Map<any, any>>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.MAP;
}

export function isFile<T extends File>(data: T | unknown): data is T {
  return Object.prototype.toString.call(data) === DATA_TYPE.FILE;
}

export default {
  isNumber,
  isString,
  isBoolean,
  isNull,
  isUndefined,
  isObject,
  isArray,
  isFunction,
  isDate,
  isRegExp,
  isPromise,
  isSet,
  isMap,
  isFile
}