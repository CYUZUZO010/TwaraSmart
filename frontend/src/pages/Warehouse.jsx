import { useEffect, useState, useCallback } from 'react'
import { Plus, Warehouse as WarehouseIcon, Boxes, Trash2 } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/shared/Modal'
import WarehouseForm from '../components/shared/WarehouseForm'
import InventoryItemForm from '../components/shared/InventoryItemForm'
import EmptyState from '../components/shared/EmptyState'
import BackButton from '../components/shared/BackButton'

export default function Warehouse() {
  const [tab, setTab] = useState('warehouses')
  const [warehouses, setWarehouses] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [warehouseModal, setWarehouseModal] = useState(false)
  const [itemModal, setItemModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([api.get('/warehouses'), api.get('/inventory')])
      .then(([w, i]) => { setWarehouses(w.data); setInventory(i.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleWarehouseSubmit = async (payload) => {
    setSubmitting(true)
    try { await api.post('/warehouses', payload); setWarehouseModal(false); load() }
    finally { setSubmitting(false) }
  }

  const handleItemSubmit = async (payload) => {
    setSubmitting(true)
    try { await api.post('/inventory', payload); setItemModal(false); load() }
    finally { setSubmitting(false) }
  }

  const deleteWarehouse = async (id) => { if (confirm('Remove this warehouse and its inventory?')) { await api.delete(`/warehouses/${id}`); load() } }
  const deleteItem = async (id) => { if (confirm('Remove this item?')) { await api.delete(`/inventory/${id}`); load() } }

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-display">Warehouse</h1>
          <p className="text-muted mt-1">Storage locations and inventory levels.</p>
        </div>
        {tab === 'warehouses'
          ? <button className="btn btn-primary" onClick={() => setWarehouseModal(true)}><Plus size={15} /> Add warehouse</button>
          : <button className="btn btn-primary" onClick={() => setItemModal(true)}><Plus size={15} /> Add item</button>}
      </div>

      <div className="flex gap-2 mb-4">
        <TabButton active={tab === 'warehouses'} onClick={() => setTab('warehouses')} icon={WarehouseIcon} label="Warehouses" />
        <TabButton active={tab === 'inventory'} onClick={() => setTab('inventory')} icon={Boxes} label="Inventory" />
      </div>

      <div className="panel">
        {loading ? (
          <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
        ) : tab === 'warehouses' ? (
          warehouses.length === 0 ? (
            <EmptyState icon={WarehouseIcon} title="No warehouses yet" description="Add your first warehouse to start tracking inventory." />
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Location</th><th style={{ textAlign: 'right' }}>Capacity</th><th style={{ textAlign: 'right' }}>Items</th><th style={{ width: 60 }}></th></tr></thead>
              <tbody>
                {warehouses.map((w) => (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 700 }}>{w.name}</td>
                    <td className="text-muted">{w.location}</td>
                    <td className="text-mono-num" style={{ textAlign: 'right' }}>{w.capacityUnits}</td>
                    <td className="text-mono-num" style={{ textAlign: 'right' }}>{w.itemCount}</td>
                    <td><button className="btn btn-danger-text btn-sm" style={{ padding: 6 }} onClick={() => deleteWarehouse(w.id)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          inventory.length === 0 ? (
            <EmptyState icon={Boxes} title="No inventory items yet" description="Add items to a warehouse to start tracking stock levels." />
          ) : (
            <table className="table">
              <thead><tr><th>SKU</th><th>Item</th><th>Warehouse</th><th style={{ textAlign: 'right' }}>Qty</th><th>Status</th><th style={{ width: 60 }}></th></tr></thead>
              <tbody>
                {inventory.map((i) => (
                  <tr key={i.id}>
                    <td className="text-muted">{i.sku}</td>
                    <td style={{ fontWeight: 600 }}>{i.name}</td>
                    <td className="text-muted">{i.warehouseName}</td>
                    <td className="text-mono-num" style={{ textAlign: 'right', fontWeight: 700, color: i.lowStock ? 'var(--color-negative)' : 'var(--color-text)' }}>{i.quantity}</td>
                    <td><span className={`badge ${i.lowStock ? 'badge-negative' : 'badge-positive'}`}>{i.lowStock ? 'Low stock' : 'In stock'}</span></td>
                    <td><button className="btn btn-danger-text btn-sm" style={{ padding: 6 }} onClick={() => deleteItem(i.id)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {warehouseModal && (
        <Modal title="Add warehouse" onClose={() => setWarehouseModal(false)}>
          <WarehouseForm onSubmit={handleWarehouseSubmit} onCancel={() => setWarehouseModal(false)} submitting={submitting} />
        </Modal>
      )}
      {itemModal && (
        <Modal title="Add inventory item" onClose={() => setItemModal(false)}>
          <InventoryItemForm warehouses={warehouses} onSubmit={handleItemSubmit} onCancel={() => setItemModal(false)} submitting={submitting} />
        </Modal>
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className="btn btn-sm" style={{
      background: active ? 'var(--color-accent-tint)' : 'var(--color-surface)',
      color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
      border: '1px solid ' + (active ? 'var(--color-accent)' : 'var(--color-border-strong)'),
    }}>
      <Icon size={14} /> {label}
    </button>
  )
}
