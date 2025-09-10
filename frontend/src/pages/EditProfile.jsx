import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Input, Button } from '@windmill/react-ui'
import AuthService from '../services/auth.service'

function EditProfile() {
  const history = useHistory()
  const location = useLocation()
  const token = AuthService.getToken && AuthService.getToken();

  const initial = {
    emriMbiemri: location.state?.user?.emriMbiemri || '',
    username: location.state?.user?.username || '',
    email: location.state?.user?.email || '',
    password: '',
  }

  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // if route provided a user keep it, otherwise you can fetch current user here
    if (!location.state?.user && token) {
      ;(async () => {
        try {
          const res = await fetch('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const data = await res.json()
            setForm(f => ({ ...f, emriMbiemri: data.emriMbiemri || '', username: data.username || '', email: data.email || '' }))
          }
        } catch (e) {
          // ignore
        }
      })()
    }
  }, [location.state, token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return history.push('/login')
    setLoading(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Update failed')
      alert('Ruaj: Changes saved')
    } catch (err) {
      alert('Ruaj: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!token) return history.push('/login')
    if (!window.confirm('A jeni të sigurt që dëshironi të fshini llogarinë?')) return
    setLoading(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      alert('Fshij: Account deleted')
      history.push('/login')
    } catch (err) {
      alert('Fshij: ' + err.message)
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
          <span className="text-sm text-gray-600 dark:text-gray-300">Username</span>
          <Input name="username" value={form.username} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-300">Email</span>
          <Input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600 dark:text-gray-300">Password</span>
          <Input name="password" type="password" value={form.password} onChange={handleChange} />
        </label>

        <div className="flex items-center space-x-3 mt-2">
          <Button type="submit" disabled={loading} layout="outline">
            Ruaj
          </Button>
          <Button type="button" onClick={handleDelete} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
            Fshij
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile;