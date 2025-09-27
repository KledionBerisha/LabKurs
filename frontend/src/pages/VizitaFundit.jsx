import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';
import { useLocation, useHistory } from 'react-router-dom';
import { getAuthHeaders } from '../services/auth';
import { fetchWithAuth } from '../services/auth';

function VizitaFundit() {
  const location = useLocation();
  const history = useHistory();
  const patient = (location.state && location.state.patient) || null;
  const initialVizita = (location.state && location.state.lastVizita) || null;

  const [vizita, setVizita] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialVizita) {
      setVizita(normalize(initialVizita));
    }
  }, [initialVizita]);

  const normalize = (obj) => {
    if (!obj) return null;
    return {
      id: obj.vizitatID || obj.VizitatID || obj.id,
      data: obj.data || obj.Data, // expect yyyy-MM-dd
      pershkrimi: obj.pershkrimi || obj.Pershkrimi || '',
      doktori: obj.doktorEmriMbiemri || obj.DoktorEmriMbiemri || extractDoctorName(obj)
    };
  };

  const extractDoctorName = (v) => {
    if (!v) return '';
    if (v.DoktorEmriMbiemri) return v.DoktorEmriMbiemri;
    if (v.doktoriEmriMbiemri) return v.doktoriEmriMbiemri;
    if (v.doktori) {
      const d = v.doktori;
      if (d.emriMbiemri) return d.emriMbiemri;
      if (d.EmriMbiemri) return d.EmriMbiemri;
      if (d.username) {
        return d.username
          .split('.')
          .map(p => p ? p[0].toUpperCase() + p.slice(1).toLowerCase() : '')
          .join(' ');
      }
    }
    return '';
  };

  // If there's no initial vizita but we have a patient, fetch the last visit
  useEffect(() => {
    const fetchLast = async () => {
      if (!patient || initialVizita) return;
      setLoading(true);
      setError(null);
      try {
        const pacientiId = patient.pacientiId || patient.PacientiID || patient.id || null;
        if (!pacientiId) {
          setError('Pacienti i pavlefshëm.');
          setLoading(false);
          return;
        }
        const res = await fetchWithAuth(`http://localhost:8080/api/vizita-fundit/pacienti/${pacientiId}`, { method: 'GET' });
        if (res.status === 401) {
          setError('Sesioni ka skaduar. Hyni përsëri.');
          setLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setVizita(normalize(data));
        } else if (res.status === 404) {
          setVizita(null);
        } else {
          setError('Nuk u mor vizita e fundit.');
        }
      } catch (e) {
        console.error(e);
        setError('Gabim rrjeti.');
      } finally {
        setLoading(false);
      }
    };
    fetchLast();
  }, [patient, initialVizita]);

  const formatDate = (d) => {
    if (!d) return '';
    // If backend already sends yyyy-MM-dd just return
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    // Try to parse fallback
    const parsed = new Date(d);
    if (!isNaN(parsed)) return parsed.toISOString().slice(0,10);
    return d;
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