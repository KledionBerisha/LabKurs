import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';
import { useLocation, useHistory } from 'react-router-dom';

function VizitaFundit() {
  const location = useLocation();
  const history = useHistory();
  const patient = (location.state && location.state.patient) || null;

  const [vizita, setVizita] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patient) return;
    const id = patient.pacientiId || patient.pacientiID || patient.id || patient.pacientId || patient.numriPersonal;
    if (!id) return;

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = user?.accessToken || user?.token || user?.access_token;
    const headers = { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };

    setLoading(true);

    // Try dedicated "last visit" endpoint first, fallback to fetching all visits and picking the latest
    fetch(`http://localhost:8080/api/vizita/fundit/pacienti/${id}`, { headers })
      .then(r => {
        if (r.ok) return r.json();
        // fallback
        return fetch(`http://localhost:8080/api/vizitat/pacienti/${id}`, { headers }).then(r2 => r2.ok ? r2.json() : []);
      })
      .then(data => {
        if (!data) {
          setVizita(null);
          return;
        }
        // If endpoint returned an array of visits, pick the latest by Data field
        if (Array.isArray(data)) {
          const sorted = data.slice().sort((a, b) => new Date(b.data || b.Data || b.DataVizite || b.Data).getTime() - new Date(a.data || a.Data || a.DataVizite || a.Data).getTime());
          setVizita(sorted[0] || null);
        } else {
          // single object result
          setVizita(data);
        }
      })
      .catch(() => setVizita(null))
      .finally(() => setLoading(false));
  }, [patient]);

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return isNaN(date.getTime()) ? String(d) : date.toLocaleString();
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
          {loading && <p>Po ngarkohet...</p>}

          {!loading && !vizita && (
            <div className=" text-gray-800 dark:text-gray-200 rounded-lg">
              Nuk u gjet asnjë vizitë për këtë pacient.
            </div>
          )}

          {!loading && vizita && (
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse border border-gray-200 dark:border-gray-700">
              <tbody>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Data</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{formatDate(vizita.Data || vizita.data)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Doktori</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{vizita.DoktorEmriMbiemri || vizita.doktoriEmriMbiemri || vizita.doktori || ''}</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Përshkrimi</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{vizita.Pershkrimi || vizita.pershkrimi || vizita.description || 'Pa përshkrim.'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">ID Vizite</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{vizita.VizitatID || vizita.vizitatID || vizita.id || ''}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </TableContainer>

      <div className="flex flex-col h-full mt-2">
        <div className="mt-auto mb-4 flex justify-start pl-4 space-x-4">
          <button onClick={() => history.goBack()} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-center">
            Kthehu
          </button>
          <button onClick={() => history.push('/app/VizitaShto'), { pacient }} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-center">
            Shto Vizite
          </button>
        </div>
      </div>
    </>
  );s
}

export default VizitaFundit;