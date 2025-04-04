import WarehouseService from '../services/WarehouseService.js';

export default class WarehouseController {
    static async createWarehouse(req, res) {
        try {
            const warehouse = await WarehouseService.createWarehouse({
                ...req.body,
                organization: req.user.organization
            });
            res.status(201).json(warehouse);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateInventory(req, res) {
        try {
            const warehouse = await WarehouseService.updateInventory(
                req.params.id,
                req.body.productId,
                req.body.quantity
            );
            res.json(warehouse);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}