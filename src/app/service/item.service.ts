import { Injectable } from '@angular/core';

import { IGeneric } from './../model/generic.model';

@Injectable()
export class ItemData {
  static items: IGeneric[] = [
    {
      id: 1,
      name: 'Bread',
      brand: 'Brittania'
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
    },
    {
      id: 4,
      name: 'Juice',
      brand: 'Tropicana'
    }
  ];
}
