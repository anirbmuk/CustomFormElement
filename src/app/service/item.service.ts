import { Injectable } from '@angular/core';

import { IGeneric } from './../model/generic.model';

@Injectable()
export class ItemData {
  static items: IGeneric[] = [
    {
      id: 1,
      name: 'Bread'
    },
    {
      id: 2,
      name: 'Butter',
      brand: 'Amul'
    },
    {
      id: 3,
      name: 'Jam',
      brand: 'Kissan'
    }
  ];
}
