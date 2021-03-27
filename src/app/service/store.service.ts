import { Injectable } from '@angular/core';

import { IGeneric } from './../model/generic.model';

@Injectable()
export class StoreData {
  static stores: IGeneric[] = [
    {
      id: 1,
      name: 'Walmart',
      location: 'Mumbai'
    },
    {
      id: 2,
      name: 'Tesco',
      location: 'Bengaluru'
    },
    {
      id: 3,
      name: 'FabIndia',
      location: 'Chennai'
    }
  ];
}
