import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';
import { useLocation, useHistory } from 'react-router-dom';
import { fetchWithAuth } from '../services/auth';

function EditVizita() {
  const location = useLocation();
  const history = useHistory();
  const patient = (location.state && location.state.patient) || null;
  const originalVisit = (location.state && location.state.visit) || null;
  const visitId = originalVisit?.id || originalVisit?.vizitatID || originalVisit?.VizitatID || null;

  const [doctors, setDoctors] = useState([]);
  const [data, setData] = useState('');
  const [doktorId, setDoktorId] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [loadingVisit, setLoadingVisit] = useState(!originalVisit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:8080/api/doktori', { method: 'GET' });
        if (!res.ok) return;
        const list = await res.json();
        setDoctors(Array.isArray(list) ? list : []);
      } catch {
        /* ignore */
      }
    };
    fetchDoctors();
  }, []);

  // Load visit from backend if not passed
  useEffect(() => {
    const load = async () => {
      if (originalVisit) {
        hydrate(originalVisit);
        setLoadingVisit(false);
        return;
      }
      if (!visitId) return;
      try {
        setLoadingVisit(true);
        const res = await fetchWithAuth(`http://localhost:8080/api/vizita/${visitId}`, { method: 'GET' });
        if (res.ok) {
          const v = await res.json();
          hydrate(v);
        } else {
            setError('Nuk u gjet vizita.');
        }
      } catch {
        setError('Gabim gjatë ngarkimit.');
      } finally {
        setLoadingVisit(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId]);

  const hydrate = (v) => {
    const d = v.data || v.Data || '';
    const p = v.pershkrimi || v.Pershkrimi || '';
    const docName = v.doktori || v.doktorEmriMbiemri || v.DoktorEmriMbiemri;
    // we don't have doctor id from DTO; user must re-select if missing
    setData(toDateValue(d));
    setPershkrimi(p);
  };

  const toDateValue = (val) => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const dt = new Date(val);
    if (isNaN(dt)) return '';
    return dt.toISOString().slice(0,10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient || !visitId) return;
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
      const res = await fetchWithAuth(`http://localhost:8080/api/vizita/${visitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) throw new Error('Sesioni ka skaduar.');
      if (!res.ok) {
        const t = await res.text().catch(()=> '');
        throw new Error(t || 'Ruajtja dështoi');
      }
      const updated = await res.json();
      const normalized = {
        id: updated.id || updated.vizitatID || updated.VizitatID,
        data: updated.data || updated.Data,
        pershkrimi: updated.pershkrimi || updated.Pershkrimi,
        doktori: updated.doktori || updated.doktorEmriMbiemri || updated.DoktorEmriMbiemri
      };
      history.push('/app/TheVisit', { visit: normalized, patient });
    } catch (er) {
      setError(er.message);
    } finally {
      setSaving(false);
    }
  };

  if (!patient) {
    return (
      <>
        <PageTitle>Modifiko Vizitë</PageTitle>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <p>Asnjë pacient i zgjedhur.</p>
        </div>
        <div className="mt-4">
          <button onClick={() => history.goBack()} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md">
            Kthehu
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle>Modifiko Vizitë - {patient.emriMbiemri}</PageTitle>
      <TableContainer>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          {error && <div className="mb-4 p-3 text-white font-bold bg-red-600 rounded">{error}</div>}
          {loadingVisit && <p>Po ngarkohet...</p>}
          {!loadingVisit && (
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
                  <option value="" disabled>Zgjidh doktorin</option>
                  {doctors.map(d => (
                    <option key={d.doktoriId || d.id || d.DoktoriID}
                            value={d.doktoriId || d.id || d.DoktoriID}>
                      {d.emriMbiemri || d.EmriMbiemri || d.username || d.Username}
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

              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white rounded-md"
                >
                  {saving ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
                </button>
                <button
                  type="button"
                  onClick={() => history.goBack()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
                >
                  Kthehu
                </button>
              </div>
            </form>
          )}
        </div>
      </TableContainer>
    </>
  );
}

export default EditVizita;