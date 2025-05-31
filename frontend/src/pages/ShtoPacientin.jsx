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
    emri: '',
    numriPersonal: '',
    dataLindjes: '',
    vendbanimi: '',
    gjinia: '',
    sigurimShendetsor: '',
    alergji: '',
    alergjiDetaje: '',
    kartelaVaksinimit: '',
    nderhyrje: '',
    nderhyrjeDetaje: '',
    semundjeKronike: '',
    semundjeKronikeDetaje: '',
    medikamente: '',
    analizaEkzaminime: '',
    analizaEkzaminimeDetaje: '',
  });

  const handleRadioChange = (field, value) => {
    setShowTextBox((prev) => ({
      ...prev,
      [field]: value === 'Po',
    }));
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      [`${field}Detaje`]: ''
  }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission, e.g., send data to an API
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      emri: '',
      numriPersonal: '',
      dataLindjes: '',
      vendbanimiID: '',
      gjinia: '',
      sigurimShendetsor: '',
      alergji: '',
      alergjiDetaje: '',
      kartelaVaksinimit: '',
      nderhyrje: '',
      nderhyrjeDetaje: '',
      semundjeKronike: '',
      semundjeKronikeDetaje: '',
      medikamente: '',
      analizaEkzaminime: '',
      analizaEkzaminimeDetaje: '',
    });
  }
  return (
    <>
      <PageTitle>Shto pacient</PageTitle>

      <form onSubmit={handleSubmit}>
      {/* Main Content */}
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* Personal Information */}
        <Label>
          <span>Emri dhe Mbiemri</span>
          <Input className="mt-1" placeholder="Emri Mbiemri" name='emri' value={formData.emri} onChange={handleChange}/>
        </Label>

        <Label className="mt-4">
          <span>Numri personal</span>
          <Input className="mt-1" placeholder="xxx..." name='numriPersonal' value={formData.numriPersonal} onChange={handleChange}/>
        </Label>

        <Label className="mt-4">
          <span>Data e Lindjes</span>
          <Input className="mt-1" placeholder="xx/xx/xxxx" name='dataLindjes' value={formData.dataLindjes} onChange={handleChange}/>
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
              <Input type="radio" value="Po" name="sigurimShendetsor" checked={formData.sigurimShendetsor === "Po"} onChange={handleChange}/>
              <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="Jo" name="sigurimShendetsor" checked={formData.sigurimShendetsor === "Jo"} onChange={handleChange} />
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
              value="Po"
              name="alergji"
              checked={formData.alergji === "Po"}
              onChange={(e) => handleRadioChange('alergji', e.target.value)}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value="Jo"
              name="alergji"
              checked={formData.alergji === "Jo"}
              onChange={(e) => handleRadioChange('alergji', e.target.value)}
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
              value="Po"
              name="nderhyrje"
              checked={formData.nderhyrje === "Po"}
              onChange={(e) => handleRadioChange('nderhyrje', e.target.value)}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value="Jo"
              name="nderhyrje"
              checked={formData.nderhyrje === "Jo"}
              onChange={(e) => handleRadioChange('nderhyrje', e.target.value)}
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
              value="Po"
              name="semundjeKronike"
              checked={formData.semundjeKronike === "Po"}
              onChange={(e) => handleRadioChange('semundjeKronike', e.target.value)}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value="Jo"
              name="semundjeKronike"
              checked={formData.semundjeKronike === "Jo"}
              onChange={(e) => handleRadioChange('semundjeKronike', e.target.value)}
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
