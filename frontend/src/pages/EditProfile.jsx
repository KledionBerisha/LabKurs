import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import AuthService from '../services/auth.service'
import { Input, Label, Button } from '@windmill/react-ui'

function EditProfile({ user, onClose }) {
  const history = useHistory()

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080'

  const resolveToken = () => {
    try {
      const t1 = AuthService.getToken && AuthService.getToken()
      if (t1 && typeof t1 === 'string') return t1
      const cur = AuthService.getCurrentUser && AuthService.getCurrentUser()
      return cur ? cur.accessToken : null
    } catch (e) {
      return null
    }
  }

  const initial = {
    emriMbiemri: user?.emriMbiemri || '',
    email: user?.email || '',
    // do NOT prefill current password from any user object or storage
    currentPassword: '',
    newPassword: '',
  }

  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        emriMbiemri: user.emriMbiemri || '',
        email: user.email || '',
        // intentionally DO NOT set currentPassword from user/profile
      }))
    }
  }, [user])

  useEffect(() => {
    // if parent didn't supply user and we have a token, try to fetch profile
    const token = resolveToken()
    if (!user && token) {
      axios
        .get(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const d = res.data || {}
          setForm(f => ({
            ...f,
            emriMbiemri: d.emriMbiemri || d.emriMbiemri || f.emriMbiemri,
            email: d.email || f.email,
          }))
        })
        .catch(() => {
          // ignore, user can still edit fields manually
        })
    }
  }, [user, API_BASE])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const normalizeMessage = (maybe) => {
    if (!maybe) return 'Unknown error'
    if (typeof maybe === 'string') return maybe
    if (maybe.error) return maybe.error
    if (maybe.message) return maybe.message
    try {
      return JSON.stringify(maybe)
    } catch (e) {
      return String(maybe)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const token = resolveToken()
    if (!token) return history.push('/login')

    // require current password on client-side as well
    if (!form.currentPassword || !form.currentPassword.trim()) {
      setError('Current password is required to save changes')
      return
    }

    setLoading(true)
    try {
      const payload = {
        emriMbiemri: form.emriMbiemri,
        email: form.email,
        currentPassword: form.currentPassword,
      }
      if (form.newPassword) payload.newPassword = form.newPassword

      const res = await axios.put(`${API_BASE}/api/users/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // if backend returns updated profile, update local stored user
      const data = res.data || {}
      try {
        const storedRaw = AuthService.getCurrentUser && AuthService.getCurrentUser()
        if (storedRaw) {
          const stored = { ...storedRaw }
          if (data.email) stored.email = data.email
          if (data.emriMbiemri) stored.emriMbiemri = data.emriMbiemri
          localStorage.setItem('user', JSON.stringify(stored))
        }
      } catch (e) {
        // ignore localStorage errors
      }

      // clear currentPassword field after successful update
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }))
      if (onClose) onClose()
    } catch (err) {
      const payload = err?.response?.data || err?.message || err
      setError(normalizeMessage(payload))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const token = resolveToken()
    if (!token) return history.push('/login')
    if (!window.confirm('A jeni të sigurt që dëshironi të fshini llogarinë?')) return

    setLoading(true)
    try {
      await axios.delete(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // logout after deletion
      try {
        AuthService.logout && AuthService.logout()
      } catch (e) {
        // ignore
      }
      history.push('/login')
    } catch (err) {
      setError(normalizeMessage(err?.response?.data || err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold text-purple-600 mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow-sm space-y-4">
        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-300">Emri Mbiemri</span>
          <Input name="emriMbiemri" value={form.emriMbiemri} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-300">Email</span>
          <Input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-300">Current Password</span>
          <Input
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            required
            placeholder="Enter current password to confirm changes"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-300">New Password</span>
          <Input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />
        </label>

        <div className="flex items-center space-x-3 mt-2">
          <Button type="submit" disabled={loading || !form.currentPassword} layout="outline">
            Ruaj
          </Button>
          <Button type="button" onClick={handleDelete} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
            Fshij
          </Button>
        </div>

        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  )
}

export default EditProfile