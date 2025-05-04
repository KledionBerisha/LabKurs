import React, { useState } from 'react';
import { SearchIcon } from '../icons';
import PageTitle from '../components/Typography/PageTitle';
import { Input, Label, Textarea, Button } from '@windmill/react-ui';
import { ReactComponent as PlusIcon } from '../icons/plus.svg';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showTextBox, setShowTextBox] = useState({
    semundjeKronike: false,
    alergji: false,
    nderhyrje: false,
  });

  const handleRadioChange = (field, value) => {
    setShowTextBox((prev) => ({
      ...prev,
      [field]: value === 'Po',
    }));
  };

  return (
    <>
      <PageTitle>Shto pacient</PageTitle>


      {/* Main Content */}
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* Personal Information */}
        <Label>
          <span>Emri dhe Mbiemri</span>
          <Input className="mt-1" placeholder="Kledion Berisha" />
        </Label>

        <Label className="mt-4">
          <span>Numri personal</span>
          <Input className="mt-1" placeholder="xxx..." />
        </Label>

        <Label className="mt-4">
          <span>Data e Lindjes</span>
          <Input className="mt-1" placeholder="xx/xx/xxxx" />
        </Label>

        <Label className="mt-4">
          <span>Adresa</span>
          <Input className="mt-1" placeholder="Rruga..." />
        </Label>

        {/* Gender Selection */}
        <div className="mt-4">
          <Label>Gjinia</Label>
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="Mashkull" name="accountType" />
              <span className="ml-2">Mashkull</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="Femer" name="accountType" />
              <span className="ml-2">Femer</span>
            </Label>
          </div>
        </div>

        {/* Health Insurance */}
        <div className="mt-4">
          <Label>A ka sigurim shendetsor?</Label>
          <div className="mt-2">
            <Label radio>
              <Input type="radio" value="Po" name="accountType" />
              <span className="ml-2">Po</span>
            </Label>
            <Label className="ml-6" radio>
              <Input type="radio" value="Jo" name="accountType" />
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
              onChange={(e) => handleRadioChange('alergji', e.target.value)}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value="Jo"
              name="alergji"
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
          />
        )}

        {/* Surgeries */}
        <Label className="mt-4">A ka pasur nderhyrje operative?</Label>
        <div className="mt-2">
          <Label radio>
            <Input
              type="radio"
              value="Po"
              name="nderhyrje"
              onChange={(e) => handleRadioChange('nderhyrje', e.target.value)}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value="Jo"
              name="nderhyrje"
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
              onChange={(e) => handleRadioChange('semundjeKronike', e.target.value)}
            />
            <span className="ml-2">Po</span>
          </Label>
          <Label className="ml-6" radio>
            <Input
              type="radio"
              value="Jo"
              name="semundjeKronike"
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
          />
        )}

        {/* Medications */}
        <Label className="mt-4">
          <span>Cilat medikamente i merr aktualisht?</span>
          <Textarea
            className="mt-1"
            rows="3"
            placeholder="Sheno medikamentet qe i merr aktualisht."
          />
        </Label>

        {/* Other Examinations */}
        <Label className="mt-4">
          <span>Analizat dhe ekzaminimet tjera</span>
          <Textarea
            className="mt-1"
            rows="3"
            placeholder="Sheno rezulatet e analizave apo ekzaminimeve tjera."
          />
        </Label>

        {/* Submit Button */}
        <div className="flex justify-center items-center px-6 my-6">
                <Button>
                  Shto pacientin
                  <span className="ml-2" aria-hidden="true">
                    +
                  </span>
                </Button>
              </div>
      </div>
    </>
  );
}

export default Dashboard;