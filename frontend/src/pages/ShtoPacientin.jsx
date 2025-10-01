import React, { useState, useEffect } from 'react'
import { Button, Input, Label, Textarea } from '@windmill/react-ui'
import PageTitle from '../components/Typography/PageTitle'
import { getAuthHeaders } from '../services/auth'

function Dashboard() {
  const [showTextBox, setShowTextBox] = useState({
    semundjeKronike: false,
    alergji: false,
    nderhyrje: false,
  });

  const [formData, setFormData] = useState({
    emriMbiemri: '',
    numriPersonal: '',
    ditelindja: '',
    vendbanimiID: '',
    gjinia: '',
    sigurimShendetsor: null,
    alergji: null,
    alergjiDetaje: '',
    kartelaVaksinimit: '',
    nderhyrje: null,
    nderhyrjeDetaje: '',
    semundjeKronike: null,
    semundjeKronikeDetaje: '',
    medikamente: '',
    analizaEkzaminime: '',
    analizaEkzaminimeDetaje: '',
  });

  const [vendbanime, setVendbanime] = useState([])
  const [manageOpen, setManageOpen] = useState(false)
  const [newVendbanim, setNewVendbanim] = useState('')
  const [vendError, setVendError] = useState('')
  const [vendLoading, setVendLoading] = useState(false)
  const [vendDependents, setVendDependents] = useState([])

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080'

    const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    })
    if (!res.ok) throw new Error('Request failed')
    return res
  }

  const loadVendbanime = async () => {
    try {
      setVendLoading(true)
      setVendError('')
      const res = await authFetch(`${API_BASE}/api/vendbanimi`)
      const data = await res.json()
      setVendbanime(data)
    } catch (e) {
      setVendError('Nuk u ngarkuan vendbanimet')
    } finally {
      setVendLoading(false)
    }
  }

  const handleAddVendbanim = async (e) => {
    e.preventDefault()
    if (!newVendbanim.trim()) return
    try {
      setVendError('')
      await authFetch(`${API_BASE}/api/vendbanimi`, {
        method: 'POST',
        body: JSON.stringify({ emri: newVendbanim.trim() })
      })
      setNewVendbanim('')
      await loadVendbanime()
    } catch {
      setVendError('Gabim në shtim')
    }
  }

  const handleDeleteVendbanim = async (id) => {
    if (!window.confirm('Fshij këtë vendbanim?')) return
    try {
      setVendError('')
      setVendDependents([])
      const res = await fetch(`${API_BASE}/api/vendbanimi/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (res.status === 409) {
        let msg = 'Nuk mund të fshihet.'
        try {
          const data = await res.json()
            if (data?.error) msg = data.error
            if (Array.isArray(data?.dependents)) {
              setVendDependents(data.dependents)
            }
        } catch {
        }
        setVendError(msg)
        return
      }

      if (!res.ok) {
        setVendError('Gabim në fshirje')
        return
      }

      setFormData(prev => prev.vendbanimiID === id ? { ...prev, vendbanimiID: '' } : prev)
      await loadVendbanime()
    } catch {
      setVendError('Gabim në fshirje')
    }
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  useEffect(() => {
    loadVendbanime()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user?.accessToken;
    if (!formData.emriMbiemri || !formData.numriPersonal || !formData.ditelindja || !formData.vendbanimiID || !formData.gjinia || formData.sigurimShendetsor === null || formData.alergji === null || formData.nderhyrje === null || formData.semundjeKronike === null) {
      alert('Ju lutem plotësoni të gjitha fushat e detyrueshme!');
      return;
    }
    if (isNaN(Number(formData.numriPersonal)) || Number(formData.numriPersonal) <= 0) {
      alert('Numri personal duhet të jetë numër i vlefshëm dhe më i madh se zero!');
      return;
    }
    if (isNaN(Number(formData.vendbanimiID)) || Number(formData.vendbanimiID) === 0) {
      alert('Zgjidhni vendbanimin!');
      return;
    }
    const pacientData = {
      emriMbiemri: formData.emriMbiemri,
      numriPersonal: Number(formData.numriPersonal),
      ditelindja: formData.ditelindja,
      vendbanimiID: Number(formData.vendbanimiID),
      gjinia: formData.gjinia,
      sigurimShendetsor: formData.sigurimShendetsor,
      alergji: formData.alergji,
      nderhyrje: formData.nderhyrje,
      semundjeKronike: formData.semundjeKronike,
    };
    console.log('Pacient Data:', pacientData);
    try {
      const response = await fetch('http://localhost:8080/api/pacientet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify(pacientData),
      });
      if (response.ok) {
        const patient = await response.json();
        console.log('Patient creation response:', patient); // DEBUG LOG
        const pacientiID = patient.pacientiID || patient.pacientiId || patient.id;
        // Send allergy details if present
        if (formData.alergji && formData.alergjiDetaje.trim()) {
          const allergyPayload = {
            pacientiID,
            pershkrimi: formData.alergjiDetaje,
          };
          console.log('Sending allergy payload:', allergyPayload); // DEBUG LOG
          await fetch('http://localhost:8080/api/alergjia', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
              },
            body: JSON.stringify(allergyPayload),
          });
        }

        // Send vaccination card details if present
        if (formData.kartelaVaksinimit.trim()) {
          await fetch('http://localhost:8080/api/kartelavaksinimit', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
              },
            body: JSON.stringify({
              pacientiID,
              pershkrimi: formData.kartelaVaksinimit,
            }),
          });
        }

        // Send surgery details if present
        if (formData.nderhyrje && formData.nderhyrjeDetaje.trim()) {
          await fetch('http://localhost:8080/api/nderhyrje', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
              },
            body: JSON.stringify({
              pacientiID,
              pershkrimi: formData.nderhyrjeDetaje,
            }),
          });
        }

        // Send chronic illness details if present
        if (formData.semundjeKronike && formData.semundjeKronikeDetaje.trim()) {
          await fetch('http://localhost:8080/api/semundjekronike', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
              },
            body: JSON.stringify({
              pacientiID,
              pershkrimi: formData.semundjeKronikeDetaje,
            }),
          });
        }

        // Send medications if present
        if (formData.medikamente.trim()) {
          await fetch('http://localhost:8080/api/medikamente', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
              },
            body: JSON.stringify({
              pacientiID,
              pershkrimi: formData.medikamente,
            }),
          });
        }

        // Send other analyses if present
        if (formData.analizaEkzaminime.trim()) {
          await fetch('http://localhost:8080/api/ankesaanaliza', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
              },
            body: JSON.stringify({
              pacientiID,
              pershkrimi: formData.analizaEkzaminime,
            }),
          });
        }
        alert('Pacienti u shtua me sukses!');
        setFormData({
          emriMbiemri: '',
          numriPersonal: '',
          ditelindja: '',
          vendbanimiID: '',
          gjinia: '',
          sigurimShendetsor: null,
          alergji: null,
          alergjiDetaje: '',
          kartelaVaksinimit: '',
          nderhyrje: null,
          nderhyrjeDetaje: '',
          semundjeKronike: null,
          semundjeKronikeDetaje: '',
          medikamente: '',
          analizaEkzaminime: '',
          analizaEkzaminimeDetaje: '',
        });
        setShowTextBox({ semundjeKronike: false, alergji: false, nderhyrje: false });
      } else {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        alert('Gabim gjatë shtimit të pacientit!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gabim në lidhje me serverin!');
    }
  };

  return (
    <>
      <PageTitle>Shto pacient</PageTitle>

      {manageOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setManageOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-out
        flex flex-col border-l border-gray-200 dark:border-gray-700
        ${manageOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!manageOpen}
      >
        <div className="px-4 py-4 flex items-center justify-between border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Menaxho Vendbanimet</h2>
          <button
            type="button"
            onClick={() => setManageOpen(false)}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {/* Content area with internal scroll (prevents panel growth) */}
        <div className="flex-1 min-h-0 flex flex-col">
          <form
            onSubmit={handleAddVendbanim}
            className="px-4 pt-4 pb-2 flex space-x-2"
          >
            <Input
              placeholder="Vendbanimi i ri"
              value={newVendbanim}
              onChange={(e) => setNewVendbanim(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="small">Shto</Button>
          </form>

            {vendError && (
              <div className="px-4 text-red-500 text-sm">
                {vendError}
                {vendDependents.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium text-red-600 dark:text-red-400 mb-1">
                      Pacientët e lidhur ({vendDependents.length}):
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto border-t border-red-300 dark:border-red-600 pt-2">
                      {vendDependents.map(p => (
                        <div key={p.id} className="flex justify-between">
                          <span className="truncate">{p.emriMbiemri}</span>
                          <span className="ml-2 opacity-70">{p.numriPersonal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          <div className="overflow-y-auto px-4 pb-4 space-y-2 flex-1">
            {vendLoading && <div className="text-sm">Duke u ngarkuar...</div>}
            {!vendLoading && vendbanime.map(v => (
              <div
                key={v.vendbanimiId}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded"
              >
                <span className="truncate">{v.emri}</span>
                <Button
                  size="small"
                  layout="outline"
                  className="text-red-600 border-red-500 hover:bg-red-50 dark:hover:bg-red-600/20"
                  type="button"
                  onClick={() => handleDeleteVendbanim(v.vendbanimiId)}
                >
                  Fshij
                </Button>
              </div>
            ))}
            {!vendLoading && vendbanime.length === 0 && (
              <div className="text-sm">Asnjë vendbanim</div>
            )}
          </div>

          <div className="p-4 border-t dark:border-gray-700">
            <Button
              block
              type="button"
              layout="outline"
              onClick={() => setManageOpen(false)}
            >
              Mbyll
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
      {/* Main Content */}
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* Personal Information */}
        <Label>
          <span>Emri dhe Mbiemri</span>
          <Input className="mt-1" placeholder="Emri Mbiemri" name='emriMbiemri' value={formData.emriMbiemri} onChange={handleChange}/>
        </Label>

        <Label className="mt-4">
          <span>Numri personal</span>
          <Input type="number" className="mt-1" placeholder="Numri Personal" name="numriPersonal" value={formData.numriPersonal} onChange={handleChange} required />
        </Label>

        <Label className="mt-4">
          <span>Data e Lindjes</span>
          <Input className="mt-1" placeholder="xx/xx/xxxx" type="date" name='ditelindja' value={formData.ditelindja} onChange={handleChange}/>
        </Label>

          <Label className="mt-4">
            <span className="text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Vendbanimi</span>
              <Button
                type="button"
                size="small"
                onClick={() => setManageOpen(true)}
                className="ml-2"
              >
                Menaxho
              </Button>
            </span>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
              name="vendbanimiID"
              value={formData.vendbanimiID}
              onChange={handleChange}
            >
              <option value="">Zgjidh</option>
              {vendbanime.map(v => (
                <option key={v.vendbanimiId} value={v.vendbanimiId}>{v.emri}</option>
              ))}
            </select>
          </Label>


        {/* Gender Selection */}
        <div className="mt-4">
          <Label>Gjinia</Label>
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="Mashkull" name="gjinia" checked={formData.gjinia === "Mashkull"} onChange={handleChange} />
              <span className="ml-2">Mashkull</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="Femer" name="gjinia" checked={formData.gjinia === "Femer"} onChange={handleChange}/>
              <span className="ml-2">Femer</span>
            </Label>
          </div>
        </div>

        {/* Health Insurance */}
        <div className="mt-4">
          <Label>A ka sigurim shendetsor?</Label>
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value={true} name="sigurimShendetsor" checked={formData.sigurimShendetsor === true} onChange={()=> setFormData(prev => ({...prev, sigurimShendetsor: true}))}/>
              <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value={false} name="sigurimShendetsor" checked={formData.sigurimShendetsor === false} onChange={()=> setFormData(prev => ({...prev, sigurimShendetsor: false}))} />
              <span className="ml-2">Jo</span>
            </Label>
          </div>
        </div>

        {/* Allergies */}
        <Label className="mt-4">A ka alergji ne medikamente?</Label>
        <div className="mt-2">
          <Label radio>
            <Input
              type="radio"
              value={true}
              name="alergji"
              checked={formData.alergji === true}
              onChange={() => {
                setFormData(prev => ({ ...prev, alergji: true }));
                setShowTextBox(prev => ({ ...prev, alergji: true }));
              }}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value={false}
              name="alergji"
              checked={formData.alergji === false}
              onChange={() => {
                setFormData(prev => ({ ...prev, alergji: false, alergjiDetaje: '' })); // clear textarea
                setShowTextBox(prev => ({ ...prev, alergji: false }));
              }}
            />
            <span className="ml-2">Jo</span>
          </Label>
        </div>
        {showTextBox.alergji && (
          <Textarea
            className="mt-1"
            rows="3"
            placeholder="Sheno detajet e alergjive."
            name="alergjiDetaje"
            value={formData.alergjiDetaje}
            onChange={handleChange}
          />
        )}
        <Label className="mt-4">
          <span>Kartela e vaksinimit</span>
          <Textarea
            className="mt-1"
            rows="3"
            placeholder="Sheno detajet e vaksinave."
            name="kartelaVaksinimit"
            value={formData.kartelaVaksinimit}
            onChange={handleChange}
          />
        </Label>

        {/* Surgeries */}
        <Label className="mt-4">A ka pasur nderhyrje operative?</Label>
        <div className="mt-2">
          <Label radio>
            <Input
              type="radio"
              value={true}
              name="nderhyrje"
              checked={formData.nderhyrje === true}
              onChange={() => {
                setFormData(prev => ({ ...prev, nderhyrje: true }));
                setShowTextBox(prev => ({ ...prev, nderhyrje: true }));
              }}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value={false}
              name="nderhyrje"
              checked={formData.nderhyrje === false}
              onChange={() => {
                setFormData(prev => ({ ...prev, nderhyrje: false, nderhyrjeDetaje: '' })); // clear textarea
                setShowTextBox(prev => ({ ...prev, nderhyrje: false }));
              }}
            />
            <span className="ml-2">Jo</span>
          </Label>
        </div>
        {showTextBox.nderhyrje && (
          <Textarea
            className="mt-1"
            rows="3"
            placeholder="Sheno detajet e nderhyrjeve operative."
            name="nderhyrjeDetaje"
            value={formData.nderhyrjeDetaje}
            onChange={handleChange}
          />
        )}

        {/* Chronic Illness */}
        <Label className="mt-4">A ka semundje kronike?</Label>
        <div className="mt-2">
          <Label radio>
            <Input
              type="radio"
              value={true}
              name="semundjeKronike"
              checked={formData.semundjeKronike === true}
              onChange={() => {
                setFormData(prev => ({ ...prev, semundjeKronike: true }));
                setShowTextBox(prev => ({ ...prev, semundjeKronike: true }));
              }}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value={false}
              name="semundjeKronike"
              checked={formData.semundjeKronike === false}
              onChange={() => {
                setFormData(prev => ({ ...prev, semundjeKronike: false, semundjeKronikeDetaje: '' })); // clear textarea
                setShowTextBox(prev => ({ ...prev, semundjeKronike: false }));
              }}
            />
            <span className="ml-2">Jo</span>
          </Label>
        </div>
        {showTextBox.semundjeKronike && (
          <Textarea
            className="mt-1"
            rows="3"
            placeholder="Sheno detajet e semundjes kronike."
            name="semundjeKronikeDetaje"
            value={formData.semundjeKronikeDetaje}
            onChange={handleChange}
          />
        )}

        {/* Medications */}
        <Label className="mt-4">
          <span>Cilat medikamente i merr aktualisht?</span>
          <Textarea
            className="mt-1"
            rows="3"
            placeholder="Sheno medikamentet qe i merr aktualisht."
            name="medikamente"
            value={formData.medikamente}
            onChange={handleChange}
          />
        </Label>

        {/* Other Examinations */}
        <Label className="mt-4">
          <span>Analizat dhe ekzaminimet tjera</span>
          <Textarea
            className="mt-1"
            rows="3"
            placeholder="Sheno rezulatet e analizave apo ekzaminimeve tjera."
            name="analizaEkzaminime"
            value={formData.analizaEkzaminime}
            onChange={handleChange}
          />
        </Label>

        {/* Submit Button */}
          <div className="flex justify-center items-center px-6 my-6">
            <Button type="submit">
              Shto pacientin
              <span className="ml-2" aria-hidden="true">+</span>
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Dashboard;
