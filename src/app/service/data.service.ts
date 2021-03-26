import { Injectable } from '@angular/core';

import { ItemModel } from '../model/item.model';
import { StoreModel } from '../model/store.model';

@Injectable()
export class DataService {

    public getData(): any {
        return {
            items: this.getItemsFromServer.bind(this),
            stores: this.getStoresFromServer.bind(this)
        };
    }

    private getItemsFromServer(): Promise<ItemModel[]> {
        return new Promise((resolve, reject) => {
            const items = this.getItems();
            if (items) {
                resolve(items);
            } else {
                reject([]);
            }
        });
    }

    private getStoresFromServer(): Promise<StoreModel[]> {
        return new Promise((resolve, reject) => {
            const stores = this.getStores();
            if (stores) {
                resolve(stores);
            } else {
                reject([]);
            }
        });
    }

    private getItems(): ItemModel[] {
        const items: ItemModel[] = [];
        items.push(new ItemModel(1, 'Bread'));
        items.push(new ItemModel(2, 'Butter', 'Amul'));
        items.push(new ItemModel(3, 'Jam', 'Maggi'));
        return items;
    }

    private getStores(): StoreModel[] {
        const stores: StoreModel[] = [];
        stores.push(new StoreModel(1, 'Walmart', 'Mumbai'));
        stores.push(new StoreModel(2, 'Tesco', 'Bangalore'));
        stores.push(new StoreModel(3, 'FabIndia', 'Chennai'));
        return stores;
    }
}
