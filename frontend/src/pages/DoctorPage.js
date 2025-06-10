import React, { useState, useEffect } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Pagination,
} from '@windmill/react-ui'

function DoctoPage() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [allPatients, setAllPatients] = useState([])
  const [searchNumriPersonal, setSearchNumriPersonal] = useState('')
  const [searchEmriMbiemri, setSearchEmriMbiemri] = useState('')

  // pagination setup
  const resultsPerPage = 10
  const totalResults = allPatients.length

  // Fetch patients from backend
  useEffect(() => {
    fetch('http://localhost:8080/api/pacientet')
      .then(res => res.json())
      .then(patients => {
        console.log('Fetched patients:', patients); // DEBUG LOG
        setAllPatients(Array.isArray(patients) ? patients : [])
        setData(Array.isArray(patients) ? patients.slice(0, resultsPerPage) : [])
      })
      .catch(err => console.error('Error fetching patients:', err))
  }, [])

  // pagination change control
  function onPageChange(p) {
    setPage(p)
    const start = (p - 1) * resultsPerPage
    setData(allPatients.slice(start, start + resultsPerPage))
  }

  // Search handler
  function handleSearch(e) {
    e.preventDefault()
    let filtered = allPatients
    if (searchNumriPersonal.trim() !== '') {
      filtered = filtered.filter(p => p.numriPersonal && p.numriPersonal.toString().includes(searchNumriPersonal.trim()))
    }
    if (searchEmriMbiemri.trim() !== '') {
      filtered = filtered.filter(p => p.emriMbiemri && p.emriMbiemri.toLowerCase().includes(searchEmriMbiemri.trim().toLowerCase()))
    }
    setData(filtered.slice(0, resultsPerPage))
    setPage(1)
  }

  return (
    <>
      <PageTitle>Kerko Pacientin</PageTitle>
      <form onSubmit={handleSearch} className="input-type-pacientat w-full flex justify-between items-center px-4 py-3 mb-4 bg-white dark:bg-gray-800 rounded-md shadow">
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Numri Personal"
            value={searchNumriPersonal}
            onChange={e => setSearchNumriPersonal(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Emri Mbiemri"
            value={searchEmriMbiemri}
            onChange={e => setSearchEmriMbiemri(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
        >
          Kërko
        </button>
      </form>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Pacienti</TableCell>
              <TableCell>Numri Personal</TableCell>
              <TableCell>Ditelindja</TableCell>
              <TableCell>Adresa</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{user.emriMbiemri}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.numriPersonal}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.ditelindja ? new Date(user.ditelindja).toLocaleDateString() : ''}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.vendbanimiID}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </>
  )
}

export default DoctoPage
