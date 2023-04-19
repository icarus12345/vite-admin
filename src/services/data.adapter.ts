import { AxiosRequestConfig } from "axios";
import { AxiosObservable } from "axios-observable";
import { Observable, Subject, finalize, map, of, share } from "rxjs";
import { $Axios } from "./request";
import { isArray, isFunction } from "../utils/common/typeof";
import LD from 'lodash';

export class DataAdapter {
  bind$: Subject<any> = new Subject();
  loading: boolean = false;
  cache: boolean = false;
  async: boolean = false;
  source: any = {};
  cachedRecords: any;
  totalRecords: number = 0;
  pageSize: number = 0;
  page: number = 0;
  pageable: boolean = false;
  constructor(source: any = {}) {
    if(isArray(source)) {
      this.cachedRecords = LD.cloneDeep(source);
      this.totalRecords = source.length;
    } else {
      this.source = source;
    }
  }

  makeData(setting: any) {
    const sorts = setting.sorts;
    const filters = setting.filters;
    const columns = LD.chain(sorts).map('column').value();
    const dirs = LD.chain(sorts).map('dir').value();
    return LD.chain(this.cachedRecords)
      .filter((row) => filters.every(([column, operator, value]: any) => {
          // if (column.filterMethod) {
          //     return column.filterMethod(row, operator, value)
          // }
          const rowValue = LD.get(row, column);
          switch(operator) {
              case 'STARTS_WITH':
                  return LD.startsWith(rowValue, value);
              case 'END_WITH':
                  return LD.endsWith(rowValue, value);
              case 'EQUAL':
                  return LD.isEqual(rowValue, value);
              case 'NOT_EQUAL':
                  return !LD.isEqual(rowValue, value);
              case 'DOES_NOT_CONTAIN':
                  return !LD.includes(rowValue, value);
              case 'NULL':
                  return (!rowValue || rowValue.length === 0)
              case 'NOT_NULL':
                  return !(!rowValue || rowValue.length === 0)
              case 'LESS_THAN':
                  return +rowValue < +value
              case 'LESS_THAN_OR_EQUAL':
                  return +rowValue <= +value
              case 'GREATER_THAN':
                  return +rowValue > +value
              case 'GREATER_THAN_OR_EQUAL':
                  return +rowValue >= +value
              case 'IN':
                  return value.includes(rowValue)
              case 'CONTAINS':
              default:
                  return LD.includes(rowValue, value);
          }
        })
      )
      .orderBy(columns, dirs)
      .value();
  }

  paging(records: any) {
    const offset = Math.max(0, this.page - 1) * this.pageSize;
    return records.slice(offset, offset + this.pageSize);
  }

  dataBind(setting: any) {
    if (this.loading == true) {
      return;
    }
    // this.totalRecords = setting.totalRecords || 0;
    // this.cache = !!setting.cache;
    // this.async = !!setting.async;
    this.pageable = !!setting.pageable;
    this.pageSize = setting.pageSize || 0;
    this.page = setting.page || 0;
    const params: any = {
      ...setting
    }
    if (isFunction(this.source.loadServerData)) {
        console.log('Call LoadServerData')
    } else if (this.source.url) {
      if (isFunction(this.source.beforeSend)) {
        this.source.beforeSend(params);
      }
      this.loading = true;
      $Axios.get(this.source.url, {
        params
      })
      .pipe(
        map((res) => {
          return res.data
        }),
        finalize(() => (this.loading = false)),
        share()
      )
      .subscribe((resource: any) => {
        this.emitParser(LD.cloneDeep(resource));
      })
    } else if(this.cachedRecords) {
      const records = this.makeData(setting);
      this.emitParser({
          records: this.paging(records),
          totalRecords: records.length
      });
    }
  }

  emitParser(resource: any) {
    if (this.source.beforeLoadComplete) {
      resource = this.source.beforeLoadComplete(resource);
    }
    this.bind$.next(resource)
  }

}
