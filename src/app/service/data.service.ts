import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ItemData } from './item.service';
import { StoreData } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  createDb() {
    return {
      items: ItemData.items,
      stores: StoreData.stores
    };
  }
}
