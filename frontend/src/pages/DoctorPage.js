import React, { useState, useEffect } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import response from '../utils/demo/tableData'
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

  // pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page])

  return (
    <>
      <PageTitle>Kerko Pacientin</PageTitle>

    
      <div className="input-type-pacientat w-full flex justify-between items-center px-4 py-3 mb-4 bg-white dark:bg-gray-800 rounded-md shadow">
  <div className="flex items-center gap-4">
    <input
      type="number"
      placeholder="Numri Personal"
      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    />

    <input
      type="text"
      placeholder="Emri Mbiemri"
      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
  <button
    className="px-5 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
  >
    Kërko
  </button>
</div>

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
