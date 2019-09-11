export class StoreModel {

    private StoreId: number;
    private StoreName: string;
    private StoreLocation: string;

    constructor(StoreId: number, StoreName: string, StoreLocation?: string) {
        this.StoreId = StoreId || -1;
        this.StoreName = StoreName;
        this.StoreLocation = StoreLocation || 'Unknown';
    }

    public getStoreid(): number {
        return this.StoreId;
    }

    public getStoreName(): string {
        return this.StoreName;
    }

    public getStoreLocation(): string {
        return this.StoreLocation;
    }
}
