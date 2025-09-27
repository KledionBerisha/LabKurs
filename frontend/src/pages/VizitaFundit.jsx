import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';
import { useLocation, useHistory } from 'react-router-dom';
import { getAuthHeaders } from '../services/auth';

function VizitaFundit() {
  const location = useLocation();
  const history = useHistory();
  const patient = (location.state && location.state.patient) || null;
  const initialVizita = (location.state && location.state.lastVizita) || null;

  const [vizita, setVizita] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If the page was opened with a pre-fetched/normalized vizita, use it immediately
  useEffect(() => {
    if (initialVizita) {
      setVizita(initialVizita);
    }
  }, [initialVizita]);

  // If there's no initial vizita but we have a patient, fetch the last visit
  useEffect(() => {
    const fetchLast = async () => {
      if (!patient) return;
      if (initialVizita) return;
      setLoading(true);
      try {
        const pacientiId = patient.pacientiId || patient.PacientiID || patient.id || patient.pacientiId || null;
        const headers = getAuthHeaders();

        const normalize = (obj) => {
          if (!obj) return null;
          const date = obj.data || obj.Data || obj.DataVizite || obj.dataVizite || null;
          const desc = obj.pershkrimi || obj.Pershkrimi || obj.description || '';
          const idVal = obj.vizitatID || obj.VizitatID || obj.id || null;
          let doktorName = obj.DoktorEmriMbiemri || obj.doktoriEmriMbiemri || '';
          if (!doktorName && obj.doktori) {
            doktorName = obj.doktori.emriMbiemri || obj.doktori.EmriMbiemri || '';
            if (!doktorName && obj.doktori.username) {
              const parts = String(obj.doktori.username).split('.');
              doktorName = parts.map(p => p ? (p[0].toUpperCase() + p.slice(1).toLowerCase()) : '').join(' ');
            }
          }
          return {
            ...obj,
            Data: date,
            Pershkrimi: desc,
            VizitatID: idVal,
            DoktorEmriMbiemri: doktorName
          };
        };

        // Try "fundit" endpoint if backend provides one
        let res = await fetch(`http://localhost:8080/api/vizita/fundit/pacienti/${pacientiId}`, { headers });
        if (res.status === 401) {
          setLoading(false);
          setError('Autentikimi mungon ose tokeni ka skaduar. Ju lutem hyni përsëri.');
          return;
        }
        if (res.ok) {
          const v = await res.json();
          setVizita(normalize(v));
          return;
        }

        // Fallback: use the list endpoint that exists and pick the first (most recent)
        res = await fetch(`http://localhost:8080/api/vizitat/pacienti/${pacientiId}`, { headers });
        if (res.status === 401) {
          setLoading(false);
          setError('Autentikimi mungon ose tokeni ka skaduar. Ju lutem hyni përsëri.');
          return;
        }
        if (res.ok) {
          const arr = await res.json();
          const v = Array.isArray(arr) && arr.length ? arr[0] : null;
          setVizita(normalize(v));
          return;
        }

        // nothing found
        setVizita(null);
      } catch (e) {
        console.error(e);
        setVizita(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLast();
  }, [patient, initialVizita]);

  const formatDate = (d) => {
    if (!d) return '';
    try {
      const date = new Date(d);
      if (isNaN(date.getTime())) return String(d);
      return date.toLocaleString();
    } catch {
      return String(d);
    }
  };

  const formatDoctor = (v) => {
    if (!v) return '';
    if (v.DoktorEmriMbiemri) return v.DoktorEmriMbiemri;
    if (v.doktoriEmriMbiemri) return v.doktoriEmriMbiemri;
    if (v.doktori) {
      const d = v.doktori;
      if (d.emriMbiemri) return d.emriMbiemri;
      if (d.EmriMbiemri) return d.EmriMbiemri;
      if (d.username) {
        const parts = String(d.username).split('.');
        return parts.map(p => p ? (p[0].toUpperCase() + p.slice(1).toLowerCase()) : '').join(' ');
      }
    }
    // fallback to any field
    return v.doktori || '';
  };

  if (!patient) {
    return (
      <>
        <PageTitle>Vizita e fundit</PageTitle>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <p>Asnjë pacient i zgjedhur.</p>
        </div>
        <div className="flex flex-col h-full mt-2">
            <div className="mt-auto mb-4 flex justify-start pl-4">
              <button onClick={() => history.goBack()} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-center">
                Kthehu
              </button>
            </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle>Vizita e fundit - {patient.emriMbiemri}</PageTitle>
      <TableContainer>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-3 text-white font-medium bg-yellow-600 rounded">
              {String(error)}
            </div>
          )}
          {loading && <p>Po ngarkohet...</p>}

          {!loading && !vizita && (
            <div className=" text-gray-800 dark:text-gray-200 rounded-lg">
              Nuk u gjet asnjë vizitë për këtë pacient.
            </div>
          )}

          {!loading && vizita && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse min-w-[420px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider p-2 border border-gray-200 dark:border-gray-700">Fusha</th>
                    <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider p-2 border border-gray-200 dark:border-gray-700">Vlera</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <td className="w-1/3 border border-gray-200 dark:border-gray-700 p-2 font-medium bg-gray-50 dark:bg-gray-800">Data</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">{formatDate(vizita.Data || vizita.data)}</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <td className="w-1/3 border border-gray-200 dark:border-gray-700 p-2 font-medium bg-gray-50 dark:bg-gray-800">Doktori</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">{formatDoctor(vizita) || vizita.DoktorEmriMbiemri || vizita.doktori || ''}</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <td className="w-1/3 border border-gray-200 dark:border-gray-700 p-2 font-medium bg-gray-50 dark:bg-gray-800">Përshkrimi</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">{vizita.Pershkrimi || vizita.pershkrimi || vizita.description || 'Pa përshkrim.'}</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <td className="w-1/3 border border-gray-200 dark:border-gray-700 p-2 font-medium bg-gray-50 dark:bg-gray-800">ID Vizite</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">{vizita.VizitatID || vizita.vizitatID || vizita.id || ''}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </TableContainer>

      <div className="flex flex-col h-full mt-2">
        <div className="mt-auto mb-4 flex justify-start pl-4 space-x-4">
          <button onClick={() => history.goBack()} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-center">
            Kthehu
          </button>
          <button onClick={() => history.push('/app/VizitaShto', { patient })} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-center">
            Shto Vizite
          </button>
        </div>
      </div>
    </>
  );
}

export default VizitaFundit;