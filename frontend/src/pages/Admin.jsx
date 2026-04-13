import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Trash2, Edit3, Save, User, Star } from 'lucide-react'

function Admin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [sellers, setSellers] = useState([])
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image_url: '', category_id: 1, seller_id: 1, stock: 10 })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSellers()
  }, [])

  const fetchProducts = async () => {
    const resp = await axios.get('http://localhost:5000/api/products')
    setProducts(resp.data)
  }

  const fetchCategories = async () => {
    const resp = await axios.get('http://localhost:5000/api/categories')
    setCategories(resp.data)
  }

  const fetchSellers = async () => {
    const resp = await axios.get('http://localhost:5000/api/sellers')
    setSellers(resp.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await axios.put('http://localhost:5000/api/admin/products', formData)
      } else {
        await axios.post('http://localhost:5000/api/admin/products', formData)
      }
      setFormData({ name: '', price: '', description: '', image_url: '', category_id: 1, stock: 10 })
      setIsEditing(false)
      fetchProducts()
    } catch (err) {
      alert('Error saving product')
    }
  }

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete('http://localhost:5000/api/admin/products', { data: { id } })
      fetchProducts()
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Inventory Management</h1>
      
      {/* Form */}
      <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Image URL</label>
            <input 
              type="text" 
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Category</label>
            <select 
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }}
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Seller</label>
            <select 
              value={formData.seller_id}
              onChange={(e) => setFormData({...formData, seller_id: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }}
            >
              {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>
            {isEditing ? 'Update Innovation' : 'Add to Catalog'}
          </button>
        </form>
      </div>

      {/* Listing */}
      <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)' }}>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.category_name}</div>
                </td>
                <td style={{ padding: '1rem' }}>${p.price}</td>
                <td style={{ padding: '1rem' }}>{p.stock}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Edit3 size={18} style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => { setFormData(p); setIsEditing(true); }} />
                    <Trash2 size={18} style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => deleteProduct(p.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Admin
