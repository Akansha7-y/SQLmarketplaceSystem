import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, Award, Star, Users } from 'lucide-react'

function Analytics() {
  const [sales, setSales] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [satisfaction, setSatisfaction] = useState([])
  const [cohorts, setCohorts] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [s, tp, sat, co] = await Promise.all([
      axios.get('http://localhost:5000/api/analytics/sales-trends'),
      axios.get('http://localhost:5000/api/analytics/top-products'),
      axios.get('http://localhost:5000/api/analytics/satisfaction'),
      axios.get('http://localhost:5000/api/analytics/cohorts')
    ])
    setSales(s.data)
    setTopProducts(tp.data)
    setSatisfaction(sat.data)
    setCohorts(co.data)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp color="var(--primary)" /> Market Analytics
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {/* Sales Trends Chart */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Monthly Revenue</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem', padding: '0 1rem' }}>
            {sales.map(s => (
              <div key={s.order_month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  background: 'linear-gradient(to top, var(--primary), var(--secondary))', 
                  height: `${(s.revenue / 2000) * 100}%`, 
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 1s ease-out'
                }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.order_month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Satisfaction Score */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Customer Satisfaction</h2>
          {satisfaction.map(p => (
            <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontWeight: 600 }}>{p.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.review_count} reviews</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                <Star size={16} fill="#fbbf24" /> {p.avg_rating.toFixed(1)}
              </div>
            </div>
          ))}
        </div>

        {/* Top Selling Products */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Top Innovators</h2>
          {topProducts.map((p, idx) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ background: 'var(--surface)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{p.name}</p>
                <div style={{ height: '4px', background: 'var(--surface)', borderRadius: '2px', marginTop: '4px' }}>
                  <div style={{ width: `${(p.total_sold / 5) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: '2px' }} />
                </div>
              </div>
              <span style={{ fontWeight: 700 }}>{p.total_sold} units</span>
            </div>
          ))}
        </div>

        {/* Cohort Analysis Table */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Cohort Retention</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Signup Cohort</th>
                <th style={{ padding: '0.5rem' }}>Month 0</th>
                <th style={{ padding: '0.5rem' }}>Month 1</th>
                <th style={{ padding: '0.5rem' }}>Month 2</th>
              </tr>
            </thead>
            <tbody>
              {/* This is a simplified display of cohort data */}
              {['2026-01', '2026-02', '2026-03'].map(cohort => {
                const row = cohorts.filter(c => c.signup_month === cohort)
                return (
                  <tr key={cohort} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>{cohort}</td>
                    {[0, 1, 2].map(m => {
                      const data = row[m]
                      const intensity = data ? (data.retained_users / 2) * 100 : 0
                      return (
                        <td key={m} style={{ 
                          padding: '0.8rem', 
                          background: intensity > 0 ? `rgba(99, 102, 241, ${intensity/100})` : 'transparent',
                          color: intensity > 50 ? 'white' : 'inherit'
                        }}>
                          {data ? `${Math.round((data.retained_users / 2) * 100)}%` : '-'}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
