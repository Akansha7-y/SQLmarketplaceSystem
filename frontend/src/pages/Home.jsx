import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Filter, Plus, ShoppingBag, Star } from 'lucide-react'

function Home({ addToCart }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [activeCategory])

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await axios.get(`http://localhost:5000/api/products?category=${activeCategory}&search=${search}`)
      setProducts(resp.data)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    const resp = await axios.get('http://localhost:5000/api/categories')
    setCategories(resp.data)
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      {/* Hero Section */}
      <section className="animate-fade" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '4rem 3rem', borderRadius: '24px', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>Future of Shopping <br/>is <span style={{ color: '#818cf8' }}>Here.</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2rem' }}>Discover curated premium products from the next generation of creators and tech innovators.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button onClick={() => setActiveCategory('')} className="btn-primary">Browse All</button>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '10px' }}>
          <button 
            onClick={() => setActiveCategory('')}
            style={{ padding: '8px 20px', borderRadius: '10px', background: activeCategory === '' ? 'var(--primary)' : 'var(--surface)', color: 'white' }}
          >All</button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.name)}
              style={{ padding: '8px 20px', borderRadius: '10px', background: activeCategory === cat.name ? 'var(--primary)' : 'var(--surface)', color: 'white', whiteSpace: 'nowrap' }}
            >{cat.name}</button>
          ))}
        </div>
        
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white' }}
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>Loading innovation...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <div key={product.id} className="glass animate-fade" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.3s ease' }}>
              <div style={{ height: '200px', background: `url(${product.image_url}) center/cover`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  {product.category_name}
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem' }}>
                    <Star size={14} fill="#fbbf24" /> {product.avg_rating ? product.avg_rating.toFixed(1) : '5.0'}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', height: '40px', overflow: 'hidden', marginBottom: '1.2rem' }}>{product.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>${product.price}</span>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>by {product.seller_name}</p>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="btn-primary" 
                    style={{ padding: '10px 14px', borderRadius: '12px' }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Home
