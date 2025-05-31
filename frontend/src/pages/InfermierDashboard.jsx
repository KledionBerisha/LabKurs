import React, { useState, useEffect } from 'react'
import { SearchIcon, EditIcon, TrashIcon } from '../icons'
import PageTitle from '../components/Typography/PageTitle'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
} from '@windmill/react-ui'
import response from '../utils/demo/tableData'

function Dashboard() {
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('')

  // Table with actions state
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState([])
  const resultsPerPage = 10
  const totalResults = response.length

  // Data slicing for pagination
  useEffect(() => {
    setTableData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page])

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* Search Bar */}
      <div className="mb-8">
        <form className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            className="w-full pl-8 pr-2 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
            type="text"
            placeholder="Kerko pacient"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Table with Action Buttons */}
      <TableContainer>
  <Table>
    <TableHeader>
      <tr>
        <TableCell>Pacienti</TableCell>
        <TableCell>Numri Personal</TableCell>
        <TableCell>Ditelindja</TableCell>
        <TableCell>Adresa</TableCell>
        <TableCell>Ndrysho</TableCell>
      </tr>
    </TableHeader>
    <TableBody>
      {tableData.map((user, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.name}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-sm">{user.NumriPersonal}</span>
          </TableCell>
          <TableCell>
            <span className="text-sm">{user.ditelindja}</span>
          </TableCell>
          <TableCell>
            <span className="text-sm">{user.adresa}</span>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-4">
              <Button layout="link" size="icon" aria-label="Edit">
                <EditIcon className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button layout="link" size="icon" aria-label="Delete">
                <TrashIcon className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <TableFooter>
    <Pagination
      totalResults={totalResults}
      resultsPerPage={resultsPerPage}
      onChange={(p) => setPage(p)}
      label="Table navigation"
    />
  </TableFooter>
</TableContainer>
    </>
  )
}

export default Dashboard