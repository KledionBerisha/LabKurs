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
    const fetchDoctors = async () => {
      try {
        const headers = getAuthHeaders();
        const res = await fetch('http://localhost:8080/api/doktori', { headers });
        if (!res.ok) throw new Error('Failed to load doctors');
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDoctors();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) return;
    setSaving(true);
    setError(null);

    // build payload - be permissive about patient id shape
    const pacientiId = patient.pacientiId || patient.PacientiID || patient.id || patient.pacientiId || null;
    const payload = {
      pacientiId,
      doktoriId: doktorId || null,
      // backend expects LocalDateTime (yyyy-MM-dd'T'HH:mm:ss') — send without timezone.
      data: (function toLocalDateTime(input) {
        if (!input) return new Date().toISOString().slice(0,19); // fallback "YYYY-MM-DDTHH:mm:ss"
        // datetime-local input is "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss"
        if (input.length === 16) return `${input}:00`;
        // if input already includes seconds, strip timezone/Z and milliseconds if present
        return String(input).replace(/Z$/,'').split('.')[0];
      })(dataTime),
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

      try {
        let last = null;

        // try use POST response body
        try {
          const created = await res.clone().json().catch(() => null);
          if (created && (created.vizitatID || created.VizitatID || created.id)) {
            last = created;
          }
        } catch (e) {
          last = null;
        }

        // fallback: fetch last visit with fresh headers
        if (!last) {
          const headers2 = { ...getAuthHeaders() };
          const r2 = await fetch(`http://localhost:8080/api/vizita/fundit/pacienti/${pacientiId}`, { headers: headers2 });
          if (r2.status === 401) {
            // token invalid / missing — redirect to login or show error
            setError('Sesioni juaj ka skaduar. Ju lutem hyni përsëri.');
            history.push('/login');
            return;
          }
          if (r2.ok) {
            last = await r2.json();
          } else {
            // fallback: fetch list
            const r3 = await fetch(`http://localhost:8080/api/vizitat/pacienti/${pacientiId}`, { headers: headers2 });
            if (r3.ok) {
              const arr = await r3.json();
              last = Array.isArray(arr) && arr.length ? arr[0] : null;
            }
          }
        }

        // normalize and navigate
        const normalize = (v) => {
          if (!v) return null;
          const date = v.data || v.Data || v.DataVizite || v.dataVizite || null;
          const desc = v.pershkrimi || v.Pershkrimi || v.description || '';
          const idVal = v.vizitatID || v.VizitatID || v.id || null;
          let doktorName = v.DoktorEmriMbiemri || v.doktoriEmriMbiemri || '';
          if (!doktorName && v.doktori) {
            doktorName = v.doktori.emriMbiemri || v.doktori.EmriMbiemri || '';
            if (!doktorName && v.doktori.username) {
              const parts = String(v.doktori.username).split('.');
              doktorName = parts.map(p => p ? (p[0].toUpperCase() + p.slice(1).toLowerCase()) : '').join(' ');
            }
          }
          return {
            ...v,
            Data: date,
            Pershkrimi: desc,
            VizitatID: idVal,
            DoktorEmriMbiemri: doktorName
          };
        };

        const normalizedLast = normalize(last);
        history.push('/app/VizitaFundit', { patient, lastVizita: normalizedLast });
      } catch (e) {
        // if fetch-last fails, go to page with patient only
        history.push('/app/VizitaFundit', { patient });
      }
      // CHANGED END
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