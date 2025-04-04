import Warehouse from '../models/Warehouse.js';

export default class WarehouseService {
    static async createWarehouse(warehouseData) {
        return Warehouse.create(warehouseData);
    }

    static async updateInventory(warehouseId, productId, quantity) {
        return Warehouse.findOneAndUpdate(
            { _id: warehouseId, 'inventory.product': productId },
            { $inc: { 'inventory.$.quantity': quantity } },
            { new: true }
        );
    }

    static async getWarehouseCapacity(organizationId) {
        return Warehouse.aggregate([
            { $match: { organization: organizationId } },
            {
                $group: {
                    _id: null,
                    totalCapacity: { $sum: "$capacity.total" },
                    usedCapacity: { $sum: "$capacity.used" }
                }
            }
        ]);
    }
}