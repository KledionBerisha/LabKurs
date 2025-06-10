import React, { useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Input, Label, Textarea, Button } from '@windmill/react-ui';

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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // For number fields, keep as string for controlled input, convert on submit
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
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
    // Make sure numriPersonal is sent as a number and not empty or zero
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
        },
        body: JSON.stringify(pacientData),
      });
      if (response.ok) {
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
          <Input type="number" className="mt-1" placeholder="xxx..." name="numriPersonal" value={formData.numriPersonal} onChange={handleChange} required />
        </Label>

        <Label className="mt-4">
          <span>Data e Lindjes</span>
          <Input className="mt-1" placeholder="xx/xx/xxxx" type="date" name='ditelindja' value={formData.ditelindja} onChange={handleChange}/>
        </Label>

        <Label className="mt-4">
          <span className="text-gray-700 dark:text-gray-300">Vendbanimi</span>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500 py-2 px-3"
              name='vendbanimiID'
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
                setFormData(prev => ({ ...prev, alergji: false }));
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
              onChange={()=>{
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
                setFormData(prev => ({ ...prev, nderhyrje: false }));
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
              onChange={()=>{
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
              onChange={()=>{
                setFormData(prev => ({ ...prev, semundjeKronike: false }));
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
                  <span className="ml-2" aria-hidden="true">
                    +
                  </span>
                </Button>
              </div>
      </div>
    </form>
    </>
  );
}

export default Dashboard;
