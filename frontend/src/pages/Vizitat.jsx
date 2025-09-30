import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import PageTitle from '../components/Typography/PageTitle';
import { fetchWithAuth } from '../services/auth';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Pagination,
  Button,
} from '@windmill/react-ui';

function Vizitat() {
  const location = useLocation();
  const history = useHistory();
  const patient = (location.state && location.state.patient) || null;

  const [items, setItems] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('sq-AL', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return d;
    }
  };

  useEffect(() => {
    if (!patient) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const pacientiId = patient.pacientiId || patient.PacientiID || patient.id;
        if (!pacientiId) {
          setError('Pacienti i pavlefshëm.');
          setLoading(false);
          return;
        }
        const res = await fetchWithAuth(`http://localhost:8080/api/vizita/pacienti/${pacientiId}`, { method: 'GET' });
        if (res.status === 401) {
          setError('Sesioni ka skaduar. Kyçu përsëri.');
          setLoading(false);
          return;
        }
        if (!res.ok) {
          setError('Gabim gjatë marrjes së vizitave.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data.map(v => ({
              id: v.id || v.vizitatID || v.vizitaId || v.VizitatID,
              data: v.data || v.Data,
              pershkrimi: v.pershkrimi || v.Pershkrimi || v.description,
              doktori: v.doktori || v.DoktorEmriMbiemri || v.doktoriEmiMbiemri || v.doktoriEmriMbiemri,
            }))
          : [];
        setItems(normalized);
        setPage(1);
        setPageItems(normalized.slice(0, perPage));
      } catch {
        setError('Gabim rrjeti.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patient]);

  const onPageChange = p => {
    setPage(p);
    const start = (p - 1) * perPage;
    setPageItems(items.slice(start, start + perPage));
  };

  if (!patient) {
    return (
      <>
        <PageTitle>Vizitat</PageTitle>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow text-sm">Asnjë pacient i zgjedhur.</div>
        <div className="mt-4">
          <button onClick={() => history.goBack()} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded">
            Kthehu
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle>Vizitat - {patient.emriMbiemri || patient.emri || ''}</PageTitle>

      <TableContainer className="mb-4">
        <div className="px-4 py-3 bg-white dark:bg-gray-800 rounded-t-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Lista e vizitave</h2>
          <div className="flex space-x-2">
            <Button size="small" onClick={() => history.push('/app/VizitaFundit', { patient })}>
              Vizita e fundit
            </Button>
            <Button size="small" onClick={() => history.push('/app/VizitaShto', { patient })}>
              Shto vizitë
            </Button>
            <Button layout="outline" size="small" onClick={() => history.goBack()}>
              Kthehu
            </Button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 mb-2 p-3 rounded bg-red-600 text-white text-xs font-medium">
            {error}
          </div>
        )}
        {loading && (
          <div className="mx-4 mt-4 mb-2 text-sm text-gray-600 dark:text-gray-300">
            Po ngarkohet...
          </div>
        )}

        {!loading && (
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Data</TableCell>
                <TableCell>Doktori</TableCell>
                <TableCell>Përshkrimi</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {pageItems.map(v => (
                <TableRow
                  key={v.id}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => history.push('/app/TheVisit', { visit: v, patient })}
                >
                  <TableCell>
                    <span className="text-sm">{formatDate(v.data)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{v.doktori || ''}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{v.pershkrimi || 'Pa përshkrim.'}</span>
                  </TableCell>
                </TableRow>
              ))}
              {pageItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-300">
                      Nuk ka vizita.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <Pagination
                totalResults={items.length}
                resultsPerPage={perPage}
                onChange={onPageChange}
                label="Navigimi"
              />
            </TableFooter>
          </Table>
        )}
      </TableContainer>
    </>
  );
}

export default Vizitat;