import { cloneDeep } from "lodash";
import { Subject } from "rxjs";
import { isObject } from "./typeof";

export class Selection {
  public items: any[] = [];
  changed: Subject<void> = new Subject();
  constructor(private multiple: boolean = true, initValue: any = []) {
    
  }
  compareWith(a: any, b: any): boolean {
    if (isObject(a) && isObject(b)) {
      return (a.id === b.id);
    }
    return a === b;
  }

  isSelected(a: any): boolean {
    return this.items.length > 0 && this.items?.some((b: any) => {
      if (isObject(a) && isObject(b)) {
        return a.id === b.id;
      }
      return a === b;
    });
  }

  findIndex(a: any): number {
    return this.items.findIndex((b: any) => {
      if (isObject(a) && isObject(b)) {
        return a.id === b.id;
      }
      return a === b;
    });
  }

  select(...items: any[]): void {
    items.filter(Boolean).map((item: any) => {
      const index = this.findIndex(item);
      if (index === -1) {
        this.items.push(cloneDeep(item));
      }
      return item.id;
    });
    this.changed.next();
  }

  deselect(...items: any[]): void {
    items.filter(Boolean).map((item: any) => {
      const index = this.findIndex(item);
      if (index >= 0) {
        this.items.splice(index, 1);
      }
      return item.id;
    });
    this.changed.next();
  }

  toggle(value: any): void {
    return this.isSelected(value) ? this.deselect(value) : this.select(value);
  }

  clear(): void {
    this.items = [];
    this.changed.next();
  }

  get selected(): any[] {
    return this.items;
  }

  hasValue(): boolean {
    return this.items.length > 0;
  }
}