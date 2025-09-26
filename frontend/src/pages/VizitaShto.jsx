import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';
import { useLocation, useHistory } from 'react-router-dom';
import { getAuthHeaders } from '../services/auth';

function VizitaShto() {
  const location = useLocation();
  const history = useHistory();
  const patient = (location.state && location.state.patient) || null;

  const [doctors, setDoctors] = useState([]);
  const [dataTime, setDataTime] = useState('');
  const [doktorId, setDoktorId] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // load doctors for select
    fetch('http://localhost:8080/api/doktori', { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t || 'Failed to load doctors'); }))
      .then(setDoctors)
      .catch(() => setDoctors([]));
  }, []);

  useEffect(() => {
    // default datetime now
    if (!dataTime) {
      const dtLocal = new Date().toISOString().slice(0,16); // "YYYY-MM-DDTHH:mm"
      setDataTime(dtLocal);
    }
    // default doctor if single
    if (!doktorId && doctors.length === 1) setDoktorId(doctors[0].doktoriId || doctors[0].doktoriID || doctors[0].id || doctors[0].DoktoriID);
  }, [doctors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient) { setError('Pacienti nuk eshte i zgjedhur'); return; }
    setSaving(true);
    setError(null);
    const headers = {...getAuthHeaders(), 'Content-Type': 'application/json' }
    const payload = {
      pacientiId: patient.pacientiId || patient.pacientiID || patient.id || patient.pacientId || patient.numriPersonal,
      doktoriId: doktorId,
      // send LocalDateTime-like string without trailing 'Z' so Jackson can parse to LocalDateTime
      data: dataTime ? (dataTime.length === 16 ? `${dataTime}:00` : dataTime) : null, 
      pershkrimi: pershkrimi
    };
    fetch('http://localhost:8080/api/vizitat', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })
      .then(async (r) => {
        if (r.ok) return r.json();
        // try parse JSON error, otherwise get text
        const text = await r.text();
        try { const j = JSON.parse(text); throw new Error(j?.message || JSON.stringify(j) || text); }
        catch (e) { throw new Error(text || 'Gabim gjatë ruajtjes'); }
      })
      .then(async () => {
        // after creating, try to fetch the latest visit for this patient and pass it to the next page
        try {
          const id = payload.pacientiId;
          const headers = getAuthHeaders();
          let last = null;
          const r2 = await fetch(`http://localhost:8080/api/vizita/fundit/pacienti/${id}`, { headers });
          if (r2.ok) last = await r2.json();
          else {
            const r3 = await fetch(`http://localhost:8080/api/vizitat/pacienti/${id}`, { headers });
            if (r3.ok) {
              const arr = await r3.json();
              last = Array.isArray(arr) ? arr[0] : arr;
            }
          }
          history.push('/app/VizitaFundit', { patient, lastVizita: last });
        } catch (e) {
          history.push('/app/VizitaFundit', { patient });
        }
      })
      .catch(err => setError(err?.message || String(err) || 'Gabim gjatë ruajtjes'))
      .finally(() => setSaving(false));
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Data dhe Ora</label>
              <input
                type="datetime-local"
                value={dataTime}
                onChange={(e) => setDataTime(e.target.value)}
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
                <option value="">Zgjidh doktorin</option>
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