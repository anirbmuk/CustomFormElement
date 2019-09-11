export class ItemModel {

    private ItemId: number;
    private ItemName: string;
    private ItemDescription: string;

    constructor(ItemId: number, ItemName: string, ItemDescription?: string) {
        this.ItemId = ItemId;
        this.ItemName = ItemName;
        this.ItemDescription = ItemDescription || 'Unknown';
    }

    public getItemId(): number {
        return this.ItemId;
    }

    public getItemName(): string {
        return this.ItemName;
    }

    public getItemDescription(): string {
        return this.ItemDescription;
    }
}
