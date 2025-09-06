import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import PageTitle from '../components/Typography/PageTitle';
import { Input, Label, Textarea, Button } from '@windmill/react-ui';
import { getAuthHeaders, getToken } from '../services/auth';

function toDateInputValue(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function EditPacientin() {
  const location = useLocation();
  const history = useHistory();
  const patient = location.state && location.state.patient ? location.state.patient : null;
  const token = getToken();

  // Debug log state
  const [debugOpen, setDebugOpen] = useState(true);
  const [debugLogs, setDebugLogs] = useState([]);
  const logsRef = useRef([]);
  const addLog = (label, obj) => {
    const time = new Date().toISOString();
    const entry = { time, label, data: obj };
    logsRef.current = [entry, ...logsRef.current].slice(0, 200); // keep last 200
    setDebugLogs([...logsRef.current]);
    console.debug('[EditPacientin DEBUG]', entry);
  };

  useEffect(() => {
    addLog('INIT', { patient, tokenPresent: !!token });
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        addLog('TOKEN_PAYLOAD', payload);
      } catch (e) {
        addLog('TOKEN_DECODE_ERROR', e.message || String(e));
      }
    } else {
      addLog('NO_TOKEN', 'No token found in localStorage');
    }
  }, []); // run once

  const [showTextBox, setShowTextBox] = useState({
    semundjeKronike: !!patient?.semundjeKronike,
    alergji: !!patient?.alergji,
    nderhyrje: !!patient?.nderhyrje,
  });

  const [formData, setFormData] = useState({
    emriMbiemri: patient?.emriMbiemri || '',
    numriPersonal: patient?.numriPersonal || '',
    ditelindja: toDateInputValue(patient?.ditelindja),
    vendbanimiID: patient?.vendbanimi?.vendbanimiId || patient?.vendbanimiID || '',
    gjinia: patient?.gjinia || '',
    sigurimShendetsor: patient?.sigurimShendetsor ?? null,
    alergji: patient?.alergji ?? null,
    alergjiDetaje: '',
    kartelaVaksinimit: '',
    nderhyrje: patient?.nderhyrje ?? null,
    nderhyrjeDetaje: '',
    semundjeKronike: patient?.semundjeKronike ?? null,
    semundjeKronikeDetaje: '',
    medikamente: '',
    analizaEkzaminime: '',
    pacientiID: patient?.pacientiID || patient?.pacientiId || patient?.id || '',
  });

  const [details, setDetails] = useState({
    alergjiDetaje: '',
    kartelaVaksinimit: '',
    nderhyrjeDetaje: '',
    semundjeKronikeDetaje: '',
    medikamente: '',
    analizaEkzaminime: '',
  });

  // safe fetch wrapper that logs everything
  const fetchWithDebug = async (url, opts = {}) => {
    addLog('FETCH_REQUEST', { url, opts: { method: opts.method || 'GET', headers: opts.headers, body: opts.body ? opts.body : undefined } });
    let res, text;
    try {
      res = await fetch(url, opts);
    } catch (err) {
      addLog('FETCH_ERROR', { url, error: String(err) });
      throw err;
    }
    try {
      text = await res.text();
      // try parse JSON
      let parsed = text;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        // leave as text
      }
      addLog('FETCH_RESPONSE', { url, status: res.status, body: parsed });
    } catch (err) {
      addLog('FETCH_READ_ERROR', { url, error: String(err) });
      throw err;
    }
    return { res, text };
  };

  useEffect(() => {
    if (!patient || !token) {
      addLog('SKIP_FETCH_DETAILS', { reason: !patient ? 'no patient' : 'no token' });
      return;
    }
    const id = patient.pacientiId || patient.pacientiID || patient.id || patient.numriPersonal;
    const headers = getAuthHeaders();
    const fetchDetails = async () => {
      try {
        const endpoints = [
          { key: 'alergji', url: `http://localhost:8080/api/alergjia/pacienti/${id}` },
          { key: 'kartelaVaksinimit', url: `http://localhost:8080/api/kartelavaksinimit/pacienti/${id}` },
          { key: 'nderhyrje', url: `http://localhost:8080/api/nderhyrje/pacienti/${id}` },
          { key: 'semundjeKronike', url: `http://localhost:8080/api/semundjekronike/pacienti/${id}` },
          { key: 'medikamente', url: `http://localhost:8080/api/medikamente/pacienti/${id}` },
          { key: 'analizaEkzaminime', url: `http://localhost:8080/api/ankesaanaliza/pacienti/${id}` },
        ];
        const results = {};
        for (const ep of endpoints) {
          try {
            const { res, text } = await fetchWithDebug(ep.url, { headers });
            if (res.ok) {
              let parsed;
              try { parsed = JSON.parse(text); } catch (e) { parsed = text; }
              results[ep.key] = parsed;
            } else {
              results[ep.key] = { error: `status ${res.status}`, body: text };
            }
          } catch (err) {
            results[ep.key] = { error: String(err) };
          }
        }
        // convert arrays to joined text if present
        setDetails({
          alergjiDetaje: Array.isArray(results.alergji) ? results.alergji.map(a => a.pershkrimi).join('\n') : (results.alergji?.body || ''),
          kartelaVaksinimit: Array.isArray(results.kartelaVaksinimit) ? results.kartelaVaksinimit.map(k => k.pershkrimi).join('\n') : (results.kartelaVaksinimit?.body || ''),
          nderhyrjeDetaje: Array.isArray(results.nderhyrje) ? results.nderhyrje.map(n => n.pershkrimi).join('\n') : (results.nderhyrje?.body || ''),
          semundjeKronikeDetaje: Array.isArray(results.semundjeKronike) ? results.semundjeKronike.map(s => s.pershkrimi).join('\n') : (results.semundjeKronike?.body || ''),
          medikamente: Array.isArray(results.medikamente) ? results.medikamente.map(m => m.pershkrimi).join('\n') : (results.medikamente?.body || ''),
          analizaEkzaminime: Array.isArray(results.analizaEkzaminime) ? results.analizaEkzaminime.map(a => a.pershkrimi).join('\n') : (results.analizaEkzaminime?.body || ''),
        });
        addLog('DETAILS_FETCHED', results);
      } catch (err) {
        addLog('DETAILS_FETCH_FATAL', String(err));
      }
    };
    fetchDetails();
  }, [patient, token]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      alergjiDetaje: details.alergjiDetaje,
      kartelaVaksinimit: details.kartelaVaksinimit,
      nderhyrjeDetaje: details.nderhyrjeDetaje,
      semundjeKronikeDetaje: details.semundjeKronikeDetaje,
      medikamente: details.medikamente,
      analizaEkzaminime: details.analizaEkzaminime,
    }));
  }, [details]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      const bool = value === 'true' || value === true;
      setFormData((prev) => ({ ...prev, [name]: bool }));
      setShowTextBox((prev) => ({ ...prev, [name]: bool }));
      if (!bool) {
        if (name === 'alergji') setFormData((prev) => ({ ...prev, alergjiDetaje: '' }));
        if (name === 'nderhyrje') setFormData((prev) => ({ ...prev, nderhyrjeDetaje: '' }));
        if (name === 'semundjeKronike') setFormData((prev) => ({ ...prev, semundjeKronikeDetaje: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateDetail = async (urlBase, value, existingArray, idField) => {
    if (!value) return { ok: true, status: 200, body: null };
    const headers = getAuthHeaders();

    // update existing
    if (Array.isArray(existingArray) && existingArray.length > 0) {
      const itemId = existingArray[0][idField];
      if (itemId) {
        const url = `http://localhost:8080/api/${urlBase}/${itemId}`;
        const { res, text } = await fetchWithDebug(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ pershkrimi: value, pacientiId: formData.pacientiID }),
        });
        return { ok: res.ok, status: res.status, body: text };
      }
    }

    // create
    const urlCreate = `http://localhost:8080/api/${urlBase}`;
    const { res, text } = await fetchWithDebug(urlCreate, {
      method: 'POST',
      headers,
      body: JSON.stringify({ pershkrimi: value, pacientiId: formData.pacientiID }),
    });
    return { ok: res.ok, status: res.status, body: text };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addLog('SUBMIT_START', { formData });
    if (!token) {
      addLog('SUBMIT_ABORT_NO_TOKEN', null);
      alert('Nuk jeni i loguar. Ju lutem identifikohuni përsëri.');
      return;
    }
    const headers = getAuthHeaders();
    addLog('USING_HEADERS', headers);
    const pacientId = formData.pacientiID;

    try {
      const { res: mainRes, text: mainText } = await fetchWithDebug(`http://localhost:8080/api/pacientet/${pacientId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });
      addLog('MAIN_PUT_RESULT', { status: mainRes.status, body: mainText });
      if (!mainRes.ok) {
        alert(`Gabim gjatë përditësimit të pacientit. (${mainRes.status})`);
        return;
      }

      let mainJson = {};
      try { mainJson = JSON.parse(mainText); } catch (e) { mainJson = {}; addLog('MAIN_PARSE_ERROR', e.message); }

      const operations = [
        { field: 'alergjiDetaje', url: 'alergjia', array: mainJson.alergjite, idField: 'alergjiaId' },
        { field: 'kartelaVaksinimit', url: 'kartelavaksinimit', array: mainJson.kartelatVaksinimit, idField: 'kartelaVaksinimitId' },
        { field: 'nderhyrjeDetaje', url: 'nderhyrje', array: mainJson.nderhyrjet, idField: 'nderhyrjeId' },
        { field: 'semundjeKronikeDetaje', url: 'semundjekronike', array: mainJson.semundjeKronikeList, idField: 'semundjeKronikeId' },
        { field: 'medikamente', url: 'medikamente', array: mainJson.medikamentet, idField: 'medikamenteId' },
        { field: 'analizaEkzaminime', url: 'ankesaanaliza', array: mainJson.ankesatAnalizat, idField: 'ankesaAnalizaId' },
      ];

      for (const op of operations) {
        const value = formData[op.field];
        if (!value) {
          addLog('SKIP_DETAIL_EMPTY', op);
          continue;
        }
        addLog('DETAIL_OP_START', { op, value });
        const result = await updateDetail(op.url, value, op.array, op.idField);
        addLog('DETAIL_OP_RESULT', { op: op.url, result });
        if (!result.ok) {
          if (result.status === 401) {
            addLog('DETAIL_401', { op: op.url });
            alert(`Autorizim i pavlefshëm për: ${op.field} (401). Kontrollo token/rolet në backend.`);
            return;
          }
          alert(`Gabim gjatë përditësimit të fushës: ${op.field}. (Status: ${result.status})`);
          return;
        }
      }

      addLog('SUBMIT_SUCCESS', null);
      alert('Pacienti u përditësua me sukses!');
      history.push('/app/InfermierDashboard');
    } catch (err) {
      addLog('SUBMIT_FATAL', String(err));
      console.error(err);
      alert('Gabim gjatë përditësimit të pacientit.');
    }
  };

  // Render
  if (!token) {
    return (
      <>
        <PageTitle>Edito Pacientin</PageTitle>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <p>Nuk jeni i identifikuar. Ju lutem identifikohuni përsëri.</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setDebugOpen(o => !o)}>{debugOpen ? 'Hide' : 'Show'} Debug</button>
            {debugOpen && <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(debugLogs, null, 2)}</pre>}
          </div>
        </div>
      </>
    );
  }

  if (!patient) {
    return (
      <>
        <PageTitle>Edito Pacientin</PageTitle>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <p>Asnjë pacient i zgjedhur.</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setDebugOpen(o => !o)}>{debugOpen ? 'Hide' : 'Show'} Debug</button>
            {debugOpen && <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(debugLogs, null, 2)}</pre>}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle>Ndrysho pacientin</PageTitle>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label>
            <span>Emri dhe Mbiemri</span>
            <Input className="mt-1" placeholder="Emri Mbiemri" name="emriMbiemri" value={formData.emriMbiemri} onChange={handleChange} />
          </Label>

          <Label className="mt-4">
            <span>Numri personal</span>
            <Input type="number" className="mt-1" placeholder="xxx..." name="numriPersonal" value={formData.numriPersonal} onChange={handleChange} required />
          </Label>

          <Label className="mt-4">
            <span>Data e Lindjes</span>
            <Input className="mt-1" placeholder="xx/xx/xxxx" type="date" name="ditelindja" value={formData.ditelindja} onChange={handleChange} />
          </Label>

          <Label className="mt-4">
            <span className="text-gray-700 dark:text-gray-300">Vendbanimi</span>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500 py-2 px-3"
              name="vendbanimiID"
              value={formData.vendbanimiID}
              onChange={handleChange}
            >
              <option value="">Qyteti</option>
              <option value="1">Prishtinë</option>
              <option value="2">Prizren</option>
              <option value="3">Pejë</option>
              <option value="4">Mitrovicë</option>
              <option value="5">Gjakovë</option>
              <option value="6">Ferizaj</option>
              <option value="7">Gjilan</option>
              <option value="8">Rahovec</option>
            </select>
          </Label>

          <div className="mt-4">
            <Label>Gjinia</Label>
            <div className="mt-2">
              <Label radio>
                <Input type="radio" value="Mashkull" name="gjinia" checked={formData.gjinia === 'Mashkull'} onChange={handleChange} />
                <span className="ml-2">Mashkull</span>
              </Label>
              <Label className="ml-6" radio>
                <Input type="radio" value="Femer" name="gjinia" checked={formData.gjinia === 'Femer'} onChange={handleChange} />
                <span className="ml-2">Femer</span>
              </Label>
            </div>
          </div>

          <div className="mt-4">
            <Label>A ka sigurim shendetsor?</Label>
            <div className="mt-2">
              <Label radio>
                <Input type="radio" value="true" name="sigurimShendetsor" checked={formData.sigurimShendetsor === true} onChange={handleChange} />
                <span className="ml-2">Po</span>
              </Label>
              <Label className="ml-6" radio>
                <Input type="radio" value="false" name="sigurimShendetsor" checked={formData.sigurimShendetsor === false} onChange={handleChange} />
                <span className="ml-2">Jo</span>
              </Label>
            </div>
          </div>

          <Label className="mt-4">A ka alergji ne medikamente?</Label>
          <div className="mt-2">
            <Label radio>
              <Input
                type="radio"
                value="true"
                name="alergji"
                checked={formData.alergji === true}
                onChange={(e) => { handleChange({ target: { name: 'alergji', value: 'true', type: 'radio' } }); }}
              />
              <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input
                type="radio"
                value="false"
                name="alergji"
                checked={formData.alergji === false}
                onChange={(e) => { handleChange({ target: { name: 'alergji', value: 'false', type: 'radio' } }); }}
              />
              <span className="ml-2">Jo</span>
            </Label>
          </div>
          {showTextBox.alergji && (
            <Textarea className="mt-1" rows="3" placeholder="Sheno detajet e alergjive." name="alergjiDetaje" value={formData.alergjiDetaje} onChange={handleChange} />
          )}

          <Label className="mt-4">
            <span>Kartela e vaksinimit</span>
            <Textarea className="mt-1" rows="3" placeholder="Sheno detajet e vaksinave." name="kartelaVaksinimit" value={formData.kartelaVaksinimit} onChange={handleChange} />
          </Label>

          <Label className="mt-4">A ka pasur nderhyrje operative?</Label>
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="true" name="nderhyrje" checked={formData.nderhyrje === true} onChange={(e) => { handleChange({ target: { name: 'nderhyrje', value: 'true', type: 'radio' } }); }} />
              <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="false" name="nderhyrje" checked={formData.nderhyrje === false} onChange={(e) => { handleChange({ target: { name: 'nderhyrje', value: 'false', type: 'radio' } }); }} />
              <span className="ml-2">Jo</span>
            </Label>
          </div>
          {showTextBox.nderhyrje && (
            <Textarea className="mt-1" rows="3" placeholder="Sheno detajet e nderhyrjeve operative." name="nderhyrjeDetaje" value={formData.nderhyrjeDetaje} onChange={handleChange} />
          )}

          <Label className="mt-4">A ka semundje kronike?</Label>
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="true" name="semundjeKronike" checked={formData.semundjeKronike === true} onChange={(e) => { handleChange({ target: { name: 'semundjeKronike', value: 'true', type: 'radio' } }); }} />
                <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="false" name="semundjeKronike" checked={formData.semundjeKronike === false} onChange={(e) => { handleChange({ target: { name: 'semundjeKronike', value: 'false', type: 'radio' } }); }} />
              <span className="ml-2">Jo</span>
            </Label>
          </div>
          {showTextBox.semundjeKronike && (
            <Textarea className="mt-1" rows="3" placeholder="Sheno detajet e semundjes kronike." name="semundjeKronikeDetaje" value={formData.semundjeKronikeDetaje} onChange={handleChange} />
          )}

          <Label className="mt-4">
            <span>Cilat medikamente i merr aktualisht?</span>
            <Textarea className="mt-1" rows="3" placeholder="Sheno medikamentet qe i merr aktualisht." name="medikamente" value={formData.medikamente} onChange={handleChange} />
          </Label>

          <Label className="mt-4">
            <span>Analizat dhe ekzaminimet tjera</span>
            <Textarea className="mt-1" rows="3" placeholder="Sheno rezulatet e analizave apo ekzaminimeve tjera." name="analizaEkzaminime" value={formData.analizaEkzaminime} onChange={handleChange} />
          </Label>

          <Button type="submit">Ruaj ndryshimet</Button>

          <div style={{ marginTop: 12 }}>
            <button type="button" onClick={() => setDebugOpen(o => !o)}>{debugOpen ? 'Hide' : 'Show'} Debug</button>
            {debugOpen && (
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Recent debug logs (newest first)</strong>
                </div>
                <pre style={{ maxHeight: 300, overflow: 'auto', background: '#111827', color: '#e5e7eb', padding: 10 }}>
                  {JSON.stringify(debugLogs.slice(0, 200), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export default EditPacientin;