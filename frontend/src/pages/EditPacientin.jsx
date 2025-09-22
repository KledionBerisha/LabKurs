import React, { useState, useEffect } from 'react';
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

  const fetchWithDebug = async (url, opts = {}) => {
    const res = await fetch(url, opts);
    const text = await res.text();
    return { res, text };
  };

  // Function to delete detail records
  const deleteDetailRecord = async (recordType, patientId) => {
    const headers = getAuthHeaders();
    
    try {
      let endpoint = '';
      switch(recordType) {
        case 'alergji':
          endpoint = `http://localhost:8080/api/alergjia/pacienti/${patientId}`;
          break;
        case 'nderhyrje':
          endpoint = `http://localhost:8080/api/nderhyrje/pacienti/${patientId}`;
          break;
        case 'semundjeKronike':
          endpoint = `http://localhost:8080/api/semundjekronike/pacienti/${patientId}`;
          break;
        default:
          return;
      }
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        console.error(`Failed to delete ${recordType} records`);
      }
    } catch (error) {
      console.error(`Error deleting ${recordType} records:`, error);
    }
  };

  useEffect(() => {
    if (!patient || !token) {
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
        setDetails({
          alergjiDetaje: Array.isArray(results.alergji) ? results.alergji.map(a => a.pershkrimi).join('\n') : (results.alergji?.body || ''),
          kartelaVaksinimit: Array.isArray(results.kartelaVaksinimit) ? results.kartelaVaksinimit.map(k => k.pershkrimi).join('\n') : (results.kartelaVaksinimit?.body || ''),
          nderhyrjeDetaje: Array.isArray(results.nderhyrje) ? results.nderhyrje.map(n => n.pershkrimi).join('\n') : (results.nderhyrje?.body || ''),
          semundjeKronikeDetaje: Array.isArray(results.semundjeKronike) ? results.semundjeKronike.map(s => s.pershkrimi).join('\n') : (results.semundjeKronike?.body || ''),
          medikamente: Array.isArray(results.medikamente) ? results.medikamente.map(m => m.pershkrimi).join('\n') : (results.medikamente?.body || ''),
          analizaEkzaminime: Array.isArray(results.analizaEkzaminime) ? results.analizaEkzaminime.map(a => a.pershkrimi).join('\n') : (results.analizaEkzaminime?.body || ''),
        });
      } catch (err) {
        // silent fail
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
      
      // If switching from Yes to No, delete the record and clear the detail field
      if (!bool) {
        if (name === 'alergji' || name === 'nderhyrje' || name === 'semundjeKronike') {
          const detailField = `${name}Detaje`;
          setFormData((prev) => ({ ...prev, [detailField]: '' }));
          
          // Delete the record from the backend
          if (patient && patient.pacientiID) {
            deleteDetailRecord(name, patient.pacientiID);
          }
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }; 

  const updateDetail = async (urlBase, value, existingArray, idField) => {
    const headers = getAuthHeaders();

    // Delete if the value is empty but Database have records
    if(!value || value.trim() === ''){
      if(Array.isArray(existingArray) && existingArray.length > 0){
        const itemId = existingArray[0][idField];
        if(itemId){
          const url = `http://localhost:8080/api/${urlBase}/${itemId}`;
          const res = await fetch(url, { method: "DELETE", headers});
          return { ok: res.ok, status: res.status,body: await res.text() };
        }
      }
      return {ok: true, status: 200, body: null};
    }

    // Update the existing records
    if(Array.isArray(existingArray) && existingArray.length > 0){
      const itemId = existingArray[0][idField];
      if(itemId) {
        const url = `http://localhost:8080/api/${urlBase}/${itemId}`;
        const res = await fetch( url, {
          method: "PUT",
          headers,
          body: JSON.stringify({ pershkrimi: value, pacientiId: formData.pacientiID}),
        });
        return { ok: res.ok, status: res.status, body: await res.text()};
      }
    }

    const urlCreate = `http://localhost:8080/api/${urlBase}`;
    const res = await fetch(urlCreate, {
      method: "POST",
      headers,
      body: JSON.stringify({ pershkrimi:value, pacientiId: formData.pacientiID}),
    });
    return { ok: res.ok, status: res.status, body: res.text()};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Nuk jeni i loguar. Ju lutem identifikohuni përsëri.');
      return;
    }
    const headers = getAuthHeaders();
    const pacientId = formData.pacientiID;

    try {
      const { res: mainRes, text: mainText } = await fetchWithDebug(`http://localhost:8080/api/pacientet/${pacientId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });
      if (!mainRes.ok) {
        alert(`Gabim gjatë përditësimit të pacientit. (${mainRes.status})`);
        return;
      }

      let mainJson = {};
      try { mainJson = JSON.parse(mainText); } catch (e) { mainJson = {}; }

      const operations = [
        { field: 'alergjiDetaje', url: 'alergjia', array: mainJson.alergjite, idField: 'alergjiaId' },
        { field: 'kartelaVaksinimit', url: 'kartelavaksinimit', array: mainJson.kartelatVaksinimit, idField: 'kartelaVaksinimitId' },
        { field: 'nderhyrjeDetaje', url: 'nderhyrje', array: mainJson.nderhyrjet, idField: 'nderhyrjeId' },
        { field: 'semundjeKronikeDetaje', url: 'semundjekronike', array: mainJson.semundjeKronikeList, idField: 'semundjeKronikeId' },
        { field: 'medikamente', url: 'medikamente', array: mainJson.medikamentet, idField: 'medikamenteId' },
        { field: 'analizaEkzaminime', url: 'ankesaanaliza', array: mainJson.ankesatAnalizat, idField: 'ankesaAnalizaId' },
      ];

      for (const op of operations) {
        const value = formData[op.field] || "";
        const result = await updateDetail(op.url, value, op.array, op.idField);

        if (!result.ok) {
            if (result.status === 401) {
              alert(`Autorizim i pavlefshëm për: ${op.field} (401). Kontrollo token/rolet në backend.`);
                return;
            }
          alert(`Gabim gjatë përditësimit të fushës: ${op.field}. (Status: ${result.status})`);
          return;
        }
      }

      alert('Pacienti u përditësua me sukses!');
      history.push('/app/InfermierDashboard');
    } catch (err) {
      console.error(err);
      alert('Gabim gjatë përditësimit të pacientit.');
    }
  };

  if (!token) {
    return (
      <>
        <PageTitle>Edito Pacientin</PageTitle>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <p>Nuk jeni i identifikuar. Ju lutem identifikohuni përsëri.</p>
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
                onChange={handleChange}
              />
              <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input
                type="radio"
                value="false"
                name="alergji"
                checked={formData.alergji === false}
                onChange={handleChange}
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
              <Input type="radio" value="true" name="nderhyrje" checked={formData.nderhyrje === true} onChange={handleChange} />
              <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="false" name="nderhyrje" checked={formData.nderhyrje === false} onChange={handleChange} />
              <span className="ml-2">Jo</span>
            </Label>
          </div>
          {showTextBox.nderhyrje && (
            <Textarea className="mt-1" rows="3" placeholder="Sheno detajet e nderhyrjeve operative." name="nderhyrjeDetaje" value={formData.nderhyrjeDetaje} onChange={handleChange} />
          )}

          <Label className="mt-4">A ka semundje kronike?</Label>
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="true" name="semundjeKronike" checked={formData.semundjeKronike === true} onChange={handleChange} />
                <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="false" name="semundjeKronike" checked={formData.semundjeKronike === false} onChange={handleChange} />
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
        </div>
      </form>
    </>
  );
}

export default EditPacientin;