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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      <PageTitle>Shto pacient</PageTitle>

      {/* Search Bar */}
      <div className="mb-8">
        <form
          onSubmit={handleSearch}
          className="relative w-full max-w-xl mr-6 focus-within:text-purple-500"
        >
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            className="w-full pl-8 pr-2 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
            type="text"
            placeholder="Search for projects, clients, etc..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

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