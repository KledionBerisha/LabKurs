import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';
import { useLocation, useHistory } from 'react-router-dom';
import { fetchWithAuth, getAuthHeaders } from '../services/auth';

function VizitaShto() {
  const location = useLocation();
  const history = useHistory();
  const patient = (location.state && location.state.patient) || null;

  const [doctors, setDoctors] = useState([]);
  // CHANGED: use only date (yyyy-MM-dd)
  const [data, setData] = useState('');
  const [doktorId, setDoktorId] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setError(null);
      try {
        const headers = getAuthHeaders();
        const res = await fetch('http://localhost:8080/api/doktori', { headers });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`Ngarkimi i doktorëve dështoi (${res.status}) ${txt}`);
        }
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length === 1) {
          const only = data[0];
          setDoktorId(only.doktoriId || only.doktoriID || only.id || only.DoktoriID || '');
        }
      } catch (e) {
        console.error(e);
        setDoctors([]);
        setError(e.message);
      }
    };
    fetchDoctors();
  }, []);

  // Initialize default date (today) and default doctor if single
  useEffect(() => {
    if (!data) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setData(`${yyyy}-${mm}-${dd}`);
    }
    if (!doktorId && doctors.length === 1) {
      const d = doctors[0];
      setDoktorId(d.doktoriId || d.doktoriID || d.id || d.DoktoriID);
    }
  }, [doctors, data, doktorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) return;
    setSaving(true);
    setError(null);

    const pacientiId =
      patient.pacientiId ||
      patient.PacientiID ||
      patient.id ||
      null;

    const payload = {
      pacientiId,
      doktoriId: doktorId ? Number(doktorId) : null,
      data,
      pershkrimi: pershkrimi || ''
    };

    try {
      const headers = { ...getAuthHeaders() };
      const res = await fetch('http://localhost:8080/api/vizitat', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to save vizita');
      }

      const headers2 = { ...getAuthHeaders() };
      let last = null;
      const rLast = await fetchWithAuth(`http://localhost:8080/api/vizitat/pacienti/${pacientiId}/last`, { method: 'GET' });
      if (rLast.ok) {
        last = await rLast.json();
      }

      const normalize = (v) => {
        if (!v) return null;
        const date = v.data || v.Data;
        const desc = v.pershkrimi || v.Pershkrimi || '';
        const idVal = v.vizitatID || v.VizitatID || v.id || null;
        let doktorName = v.DoktorEmriMbiemri || (v.doktori && (v.doktori.emriMbiemri || v.doktori.EmriMbiemri)) || '';
        return {
          ...v,
          Data: date,
          Pershkrimi: desc,
          VizitatID: idVal,
          DoktorEmriMbiemri: doktorName
        };
      };

      history.push('/app/VizitaFundit', { patient, lastVizita: normalize(last) });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gabim gjate ruajtjes');
    } finally {
      setSaving(false);
    }
  };

  if (!patient) {
    return (
      <>
        <PageTitle>Shto Vizitë</PageTitle>
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
      <PageTitle>Shto Vizitë - {patient.emriMbiemri}</PageTitle>
      <TableContainer>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          {error && <div className="mb-4 p-3 text-white font-bold bg-red-600 rounded">{String(error)}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Data</label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white dark:bg-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Doktori</label>
                <select
                  value={doktorId}
                  onChange={(e) => setDoktorId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white dark:bg-gray-800"
                  required
                >
                  <option value="" disabled>{doctors.length === 0 ? 'Nuk ka doktorë' : 'Zgjidh doktorin'}</option>
                  {doctors.map(d => (
                    <option key={d.doktoriId || d.doktoriID || d.id || d.DoktoriID} value={d.doktoriId || d.doktoriID || d.id || d.DoktoriID}>
                      {d.emriMbiemri || d.EmriMbiemri || d.username || d.Username || `Dr ${d.doktoriId || d.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Përshkrimi</label>
                <textarea
                  value={pershkrimi}
                  onChange={(e) => setPershkrimi(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white dark:bg-gray-800"
                  rows={4}
                />
              </div>

              <div className="flex items-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
                >
                  {saving ? 'Duke ruajtur...' : 'Shto Vizitë'}
                </button>

                <button type="button" onClick={() => history.goBack()} className="ml-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md">
                  Kthehu
                </button>
              </div>
            </form>
        </div>
      </TableContainer>
    </>
  );
}

export default VizitaShto;