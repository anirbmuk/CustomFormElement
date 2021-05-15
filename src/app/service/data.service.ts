import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { BehaviorSubject, Observable } from 'rxjs';

import { ItemData } from './item.service';
import { StoreData } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  private value: BehaviorSubject<any> = new BehaviorSubject<any>({});
  readonly value$: Observable<any> = this.value.asObservable();

  createDb() {
    return {
      items: ItemData.items,
      stores: StoreData.stores
    };
  }

  print(value: any): void {
    this.value.next(value);
  }
}
