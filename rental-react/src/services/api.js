/**
 * API Service Layer
 * 
 * This module provides a clean interface for backend communication.
 * Currently uses sample data for development. Replace the implementations
 * with real API calls when backend is ready.
 * 
 * BACKEND INTEGRATION POINTS:
 * - Replace SAMPLE_* constants with actual fetch() calls
 * - Add proper error handling for network failures
 * - Add authentication headers from AuthContext
 */

const API_BASE = '/api'  // Configure this for your backend

// ============================================================
// SAMPLE DATA (Remove when backend is connected)
// ============================================================
const SAMPLE_USERS = [
  { id: 'U001', name: 'Alice Santos', email: 'alice@example.com', role: 'Admin', status: 'Active', created: '2025-11-01' },
  { id: 'U002', name: 'Bob Reyes', email: 'bob@example.com', role: 'Customer', status: 'Active', created: '2025-12-10' },
  { id: 'U003', name: 'Carol Diaz', email: 'carol@example.com', role: 'Customer', status: 'Inactive', created: '2026-01-05' },
]

const SAMPLE_RENTALS = [
  { id: 'R001', user: 'Alice Santos', date: '2026-01-20', hours: 4, total: '₱1,200', status: 'Completed', created: '2026-01-20' },
  { id: 'R002', user: 'Bob Reyes', date: '2026-01-22', hours: 6, total: '₱1,800', status: 'Pending', created: '2026-01-22' },
  { id: 'R003', user: 'Carol Diaz', date: '2026-01-25', hours: 3, total: '₱900', status: 'Active', created: '2026-01-25' },
]

const SAMPLE_ITEMS = [
  { id: 'I001', name: 'Videoke Pro X1', category: 'Machine', rate: '₱300/hr', status: 'Available', created: '2025-10-01' },
  { id: 'I002', name: 'Wireless Mic Set', category: 'Accessory', rate: '₱100/hr', status: 'Rented', created: '2025-10-15' },
  { id: 'I003', name: 'Speaker System', category: 'Audio', rate: '₱150/hr', status: 'Available', created: '2025-11-20' },
]

const SAMPLE_PAYMENTS = [
  { id: 'P001', rental: 'R001', customer: 'Alice Santos', amount: '₱1,200', method: 'GCash', status: 'Paid', date: '2026-01-20' },
  { id: 'P002', rental: 'R002', customer: 'Bob Reyes', amount: '₱900', method: 'Cash', status: 'Partial', date: '2026-01-22' },
]

// ============================================================
// HELPER: Simulate network delay (remove for production)
// ============================================================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function safeFetch(url, fallbackData) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network error')
    return await response.json()
  } catch {
    // Fallback to sample data during development
    await delay(800) // Simulate network latency
    return fallbackData
  }
}

// ============================================================
// SERVICE EXPORTS
// ============================================================

export const usersService = {
  getAll: () => safeFetch(`${API_BASE}/users`, SAMPLE_USERS),
  getById: (id) => safeFetch(`${API_BASE}/users/${id}`, SAMPLE_USERS.find(u => u.id === id)),
  create: (data) => safeFetch(`${API_BASE}/users`, { ...data, id: `U${Date.now()}` }),
  update: (id, data) => safeFetch(`${API_BASE}/users/${id}`, { ...data, id }),
  delete: (id) => safeFetch(`${API_BASE}/users/${id}`, { success: true }),
}

export const rentalsService = {
  getAll: () => safeFetch(`${API_BASE}/rentals`, SAMPLE_RENTALS),
  getById: (id) => safeFetch(`${API_BASE}/rentals/${id}`, SAMPLE_RENTALS.find(r => r.id === id)),
  create: (data) => safeFetch(`${API_BASE}/rentals`, { ...data, id: `R${Date.now()}` }),
  update: (id, data) => safeFetch(`${API_BASE}/rentals/${id}`, { ...data, id }),
  delete: (id) => safeFetch(`${API_BASE}/rentals/${id}`, { success: true }),
}

export const itemsService = {
  getAll: () => safeFetch(`${API_BASE}/items`, SAMPLE_ITEMS),
  getById: (id) => safeFetch(`${API_BASE}/items/${id}`, SAMPLE_ITEMS.find(i => i.id === id)),
  create: (data) => safeFetch(`${API_BASE}/items`, { ...data, id: `I${Date.now()}` }),
  update: (id, data) => safeFetch(`${API_BASE}/items/${id}`, { ...data, id }),
  delete: (id) => safeFetch(`${API_BASE}/items/${id}`, { success: true }),
}

export const paymentsService = {
  getAll: () => safeFetch(`${API_BASE}/payments`, SAMPLE_PAYMENTS),
  getById: (id) => safeFetch(`${API_BASE}/payments/${id}`, SAMPLE_PAYMENTS.find(p => p.id === id)),
  create: (data) => safeFetch(`${API_BASE}/payments`, { ...data, id: `P${Date.now()}` }),
}
