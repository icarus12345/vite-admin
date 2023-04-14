import { AxiosRequestConfig } from "axios";
import { AxiosObservable } from "axios-observable";
import { Observable, Subject, finalize, map, of, share } from "rxjs";
import { $Axios } from "./request";
import { isFunction } from "../utils/common/typeof";
import { cloneDeep } from 'lodash';

export class DataAdapter {
  bind$: Subject<any> = new Subject();
  loading: boolean = false;
  cache: boolean = false;
  async: boolean = false;
  source: any;
  setting: any;
  records: any = new Array();
  originalData: any = new Array();
  cachedRecords: any = new Array();
  totalRecords: number = 0;
  pageSize: number = 0;
  page: number = 0;
  pageable: boolean = false;
  constructor(source: any = {}, setting: any = {}) {
    this.source = source;
    this.setting = setting;
  }

  filterData() {
    return 
  }

  sortData() {

  }

  dataBind(setting: any) {
    if (this.loading == true) {
      return;
    }
    this.records = new Array();
    // this.totalRecords = setting.totalRecords || 0;
    // this.cache = !!setting.cache;
    // this.async = !!setting.async;
    this.pageable = !!setting.pageable;
    this.pageSize = setting.pageSize || 0;
    this.page = setting.page || 0;
    this.cachedRecords = setting.cachedRecords || new Array();
    this.originalData = new Array();
    console.log('databind', setting)
    const params: any = {
      ...setting
    }
    if (isFunction(this.source.loadServerData)) {
        console.log('Call LoadServerData')
    } else if (this.source.url) {
      console.log('Call ServerData')
      if (isFunction(this.source.beforeSend)) {
        console.log('Call BeforeSend')
        this.source.beforeSend(params);
        console.log(params)
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
        this.emitParser(cloneDeep(resource));
      })
    } else if (this.source.records) {
      console.log('Call LocalData')
      this.emitParser(cloneDeep(this.source.records));
    }
  }

  emitParser(resource: any) {
    if (this.source.beforeLoadComplete) {
      resource = this.source.beforeLoadComplete(resource);
    }
    this.bind$.next(resource)
  }

}
