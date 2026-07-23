import { useState } from 'react'

export default function InventoryItemForm({ warehouses, initial, onSubmit, onCancel, submitting }) {
  const [warehouseId, setWarehouseId] = useState(initial?.warehouseId ?? '')
  const [sku, setSku] = useState(initial?.sku ?? '')
  const [name, setName] = useState(initial?.name ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? '')
  const [reorderThreshold, setReorderThreshold] = useState(initial?.reorderThreshold ?? '10')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!warehouseId || !sku.trim() || !name.trim()) { setError('Warehouse, SKU, and name are required.'); return }
    try {
      await onSubmit({
        warehouseId: Number(warehouseId), sku: sku.trim(), name: name.trim(),
        quantity: quantity ? Number(quantity) : 0,
        reorderThreshold: reorderThreshold ? Number(reorderThreshold) : 10,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this item.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-4">
      <div className="field">
        <label>Warehouse</label>
        <select className="select" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} autoFocus>
          <option value="">Choose a warehouse</option>
          {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>SKU</label>
          <input className="input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-001" />
        </div>
        <div className="field">
          <label>Item name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Packing boxes" />
        </div>
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label>Quantity</label>
          <input className="input" type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div className="field">
          <label>Reorder threshold</label>
          <input className="input" type="number" min="0" value={reorderThreshold} onChange={(e) => setReorderThreshold(e.target.value)} />
        </div>
      </div>
      {error && <div style={{ background: 'var(--color-negative-tint)', color: 'var(--color-negative)', padding: '10px 12px', borderRadius: 4, fontSize: 13 }}>{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}
