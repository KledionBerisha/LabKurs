import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../services/auth';
import { TableContainer } from '@windmill/react-ui';

function TheVisit() {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const passedVisit = location.state && location.state.visit;
  const patient = location.state && location.state.patient;
  const [visit, setVisit] = useState(passedVisit || null);
  const [loading, setLoading] = useState(!passedVisit);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (visit) return;
    const id = params.id || (passedVisit && (passedVisit.id || passedVisit.vizitatID));
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(`http://localhost:8080/api/vizita/${id}`, { method: 'GET' });
        if (res.status === 401) {
          setError('Sesioni ka skaduar. Kyçu përsëri.');
        } else if (res.ok) {
          const d = await res.json();
            setVisit({
              id: d.id || d.vizitatID || d.VizitatID,
              data: d.data || d.Data,
              pershkrimi: d.pershkrimi || d.Pershkrimi || '',
              doktori: d.doktori || d.doktorEmriMbiemri || d.DoktorEmriMbiemri
            });
        } else if (res.status === 404) {
          setError('Vizita nuk u gjet.');
        } else {
          setError('Gabim gjatë ngarkimit të vizitës.');
        }
      } catch {
        setError('Gabim rrjeti.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [visit, params, passedVisit]);

  const formatDate = (d) => {
    if (!d) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const t = new Date(d);
    if (!isNaN(t)) return t.toISOString().slice(0,10);
    return d;
  };

  const handleDelete = async () => {
    if (!visit || !visit.id) return;
    if (!window.confirm('Fshije këtë vizitë?')) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetchWithAuth(`http://localhost:8080/api/vizita/${visit.id}`, { method: 'DELETE' });
      if (res.status === 401) {
        setDeleteError('Sesioni ka skaduar.');
      } else if (res.status === 204) {
        history.push('/app/Vizitat', { patient });
      } else if (res.status === 404) {
        setDeleteError('Vizita nuk u gjet.');
      } else {
        const t = await res.text().catch(()=> '');
        setDeleteError('Fshirja dështoi. ' + t);
      }
    } catch {
      setDeleteError('Gabim rrjeti.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageTitle>Vizita e zgjedhur {patient ? `- ${patient.emriMbiemri || ''}` : ''}</PageTitle>
      <TableContainer>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-3 text-white font-medium bg-red-600 rounded">
              {error}
            </div>
          )}
          {deleteError && (
            <div className="mb-4 p-3 text-white font-medium bg-red-700 rounded">
              {deleteError}
            </div>
          )}
          {loading && <p>Po ngarkohet...</p>}
          {!loading && !visit && !error && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Nuk ka të dhëna për këtë vizitë.
            </div>
          )}
          {!loading && visit && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse min-w-[420px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider p-2 border border-gray-200 dark:border-gray-700">Fusha</th>
                    <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider p-2 border border-gray-200 dark:border-gray-700">Vlera</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="w-1/3 border border-gray-200 dark:border-gray-700 p-2 font-medium bg-gray-50 dark:bg-gray-800">Data</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">{formatDate(visit.data)}</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="w-1/3 border border-gray-200 dark:border-gray-700 p-2 font-medium bg-gray-50 dark:bg-gray-800">Doktori</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">{visit.doktori || ''}</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="w-1/3 border border-gray-200 dark:border-gray-700 p-2 font-medium bg-gray-50 dark:bg-gray-800">Përshkrimi</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">{visit.pershkrimi || 'Pa përshkrim.'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </TableContainer>
      <div className="flex mt-4 space-x-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white rounded-md"
        >
          {deleting ? 'Duke fshirë...' : 'Fshij vizitën'}
        </button>
        <button
          onClick={() => history.push('/app/EditVizita', { visit, patient })}
          disabled={!visit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-md"
        >
          EditVizita
        </button>
        <button
          onClick={() => history.goBack()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
        >
          Kthehu
        </button>
        <button
          onClick={() => history.push('/app/VizitaShto', { patient })}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
        >
          Shto vizitë
        </button>
        <button
          onClick={() => history.push('/app/VizitaFundit', { patient })}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
        >
          Vizita e fundit
        </button>
      </div>
    </>
  );
}

export default TheVisit;