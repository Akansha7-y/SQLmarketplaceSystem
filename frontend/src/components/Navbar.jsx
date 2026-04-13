import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, LayoutGrid, User, Search, X } from 'lucide-react'
import axios from 'axios'

function Navbar({ cartCount, cart, removeFromCart, clearCart }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/order', {
        items: cart,
        total: total
      })
      if (response.data.success) {
        alert('Order placed successfully! Order ID: ' + response.data.order_id)
        clearCart()
        setIsCartOpen(false)
      }
    } catch (err) {
      alert('Checkout failed. Please try again.')
    }
  }

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          MARKET-X
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text)' }}>Explore</Link>
          <Link to="/admin">Dashboard</Link>
          <Link to="/analytics">Analytics</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setIsCartOpen(!isCartOpen)} style={{ background: 'var(--surface)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span style={{ background: 'var(--accent)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '50%', position: 'absolute', top: '-5px', right: '-5px' }}>{cartCount}</span>}
          </button>

          {isCartOpen && (
            <div className="glass animate-fade" style={{ position: 'absolute', top: '120%', right: 0, width: '320px', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Your Cart</h3>
                <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsCartOpen(false)} />
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>Cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.quantity} x ${item.price}</p>
                      </div>
                      <X size={14} style={{ color: '#ef4444', cursor: 'pointer' }} onClick={() => removeFromCart(item.id)} />
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 700 }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%' }}>Checkout Now</button>
                </div>
              )}
            </div>
          )}
        </div>
        <User size={20} style={{ color: 'var(--text-muted)' }} />
      </div>
    </nav>
  )
}

export default Navbar
