package com.twarasmart.repository;

import com.twarasmart.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByWarehouseId(Long warehouseId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT i FROM InventoryItem i WHERE i.quantity <= i.reorderThreshold")
    List<InventoryItem> findLowStock();
}
